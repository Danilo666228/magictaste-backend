import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
	type: ToastType
	title: string
	message: string
	duration?: number
}

@Injectable()
export class NotificationsService {
	private connectedUsers = new Map<string, Set<string>>() // userId -> Set<socketId>
	private anonymousUsers = new Map<string, string>() // temporaryId -> socketId
	private server: Server

	constructor(private readonly prismaService: PrismaService) {}

	setServer(server: Server) {
		this.server = server
	}

	addUserSocket(userId: string | null, socketId: string, temporaryId?: string) {
		// console.log('Adding socket connection:', { userId, socketId, temporaryId })

		if (!userId && temporaryId) {
			this.anonymousUsers.set(temporaryId, socketId)
			// console.log('Current anonymous connections:', this.anonymousUsers)
			return
		}

		if (!this.connectedUsers.has(userId)) {
			this.connectedUsers.set(userId, new Set())
		}
		this.connectedUsers.get(userId).add(socketId)
		// console.log(`Added socket ${socketId} for user ${userId}`)
	}

	removeUserSocket(userId: string | null, socketId: string, temporaryId?: string) {
		if (!userId && temporaryId) {
			this.anonymousUsers.delete(temporaryId)
			// console.log(`Removed anonymous socket ${socketId}`)
			return
		}

		const userSockets = this.connectedUsers.get(userId)
		if (userSockets) {
			userSockets.delete(socketId)
			if (userSockets.size === 0) {
				this.connectedUsers.delete(userId)
			}
			// console.log(`Removed socket ${socketId} for user ${userId}`)
		}
	}

	getUserSockets(userId: string | null): string[] {
		if (!userId) return []
		return Array.from(this.connectedUsers.get(userId) || [])
	}

	async create(data: {
		accountId?: string
		socketId?: string
		title: string
		message: string
		type?: ToastType
		save?: boolean
	}) {
		const notification = this.createNotification(data.type || 'success', data.title, data.message)
		const account = await this.prismaService.account.findUnique({
			where: { id: data.accountId },
			include: { accountSettings: true }
		})

		let savedNotification = null

		if (data.accountId) {
			// Для авторизованного пользователя
			const userExists = await this.prismaService.account.findUnique({
				where: { id: data.accountId }
			})

			if (userExists && account?.accountSettings.siteNotification && data.save) {
				savedNotification = await this.prismaService.notification.create({
					data: {
						accountId: data.accountId,
						type: 'ORDER',
						link: '',
						title: notification.title,
						message: notification.message,
						isRead: false
					}
				})
			}

			// Отправляем уведомление всем сокетам авторизованного пользователя
			const sockets = this.getUserSockets(data.accountId)
			// console.log(`Sending notification to user ${data.accountId} sockets:`, sockets)

			sockets?.forEach(socketId => {
				this.server.to(socketId).emit('toast', notification)
			})

			// Если уведомление было сохранено в БД, обновляем список уведомлений
			if (savedNotification) {
				// Получаем все уведомления пользователя
				const allNotifications = await this.getAllNotificationsByAccountId(data.accountId)

				// Отправляем обновленный список уведомлений всем сокетам пользователя
				sockets?.forEach(socketId => {
					this.server.to(socketId).emit('notifications', allNotifications)
				})
			}
		} else if (data.socketId) {
			// Для анонимного пользователя отправляем уведомление только в конкретный сокет
			this.server.to(data.socketId).emit('toast', notification)
		}

		return notification
	}

	createNotification(type: ToastMessage['type'], title: string, message: string, duration = 5000): ToastMessage {
		return {
			type,
			title,
			message,
			duration
		}
	}

	async getPendingNotifications(userId: string): Promise<ToastMessage[]> {
		try {
			const notifications = await this.prismaService.notification.findMany({
				where: {
					accountId: userId,
					isRead: false
				},
				orderBy: {
					createdAt: 'desc'
				}
			})

			return notifications.map(notification => ({
				type: notification.type as ToastType,
				title: notification.title,
				message: notification.message,
				duration: 5000
			}))
		} catch (error) {
			// console.error('Error fetching pending notifications:', error)
			return []
		}
	}

	getConnectedUsers(): string[] {
		return Array.from(this.connectedUsers.keys())
	}

	// Метод для широковещательной рассылки всем пользователям
	broadcast(notification: ToastMessage) {
		this.server.emit('toast', notification)
	}

	async sendToAnonymous(temporaryId: string, notification: Partial<ToastMessage>) {
		// console.log('Attempting to send notification to anonymous user:', {
		// 	temporaryId,
		// 	notification
		// })

		const socketId = this.anonymousUsers.get(temporaryId)
		// console.log('Found socketId for temporaryId:', {
		// 	temporaryId,
		// 	socketId,
		// 	allAnonymousUsers: Object.fromEntries(this.anonymousUsers)
		// })

		if (socketId) {
			const toast = this.createNotification(
				notification.type || 'info',
				notification.title,
				notification.message,
				notification.duration
			)

			this.server.to(socketId).emit('toast', toast)

			return true
		} else {
			return false
		}
	}

	// Новый метод для отправки по socketId
	async sendToSocket(socketId: string, notification: Partial<ToastMessage>) {
		const toast = this.createNotification(
			notification.type || 'info',
			notification.title,
			notification.message,
			notification.duration
		)
		this.server.to(socketId).emit('toast', toast)
	}
	public async getAllNotificationsByAccountId(accountId: string) {
		const notifications = await this.prismaService.notification.findMany({
			where: {
				accountId
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		return notifications
	}

	// Метод для получения socketId по temporaryId
	getSocketIdByTemporaryId(temporaryId: string): string | undefined {
		const socketId = this.anonymousUsers.get(temporaryId)
		// console.log('Looking up socketId for temporaryId:', temporaryId, 'Found:', socketId)
		return socketId
	}

	// Метод для получения всех анонимных socketId
	getAllAnonymousSocketIds(): string[] {
		return Array.from(this.anonymousUsers.values())
	}

	public async markNotificationAsRead(notificationId: string, userId: string) {
		try {
			const notification = await this.prismaService.notification.findFirst({
				where: {
					id: notificationId,
					accountId: userId
				}
			})

			if (!notification) {
				return { success: false, message: 'Notification not found' }
			}

			await this.prismaService.notification.update({
				where: { id: notificationId },
				data: { isRead: true }
			})

			return { success: true, message: 'Notification marked as read' }
		} catch (error) {
			return { success: false, message: 'Failed to mark notification as read' }
		}
	}

	public async markAllNotificationsAsRead(userId: string) {
		try {
			await this.prismaService.notification.updateMany({
				where: {
					accountId: userId,
					isRead: false
				},
				data: { isRead: true }
			})

			return { success: true, message: 'All notifications marked as read' }
		} catch (error) {
			return { success: false, message: 'Failed to mark notifications as read' }
		}
	}

	public async deleteNotification(notificationId: string, userId: string) {
		try {
			const notification = await this.prismaService.notification.findFirst({
				where: {
					id: notificationId,
					accountId: userId
				}
			})

			if (!notification) {
				return { success: false, message: 'Notification not found' }
			}

			await this.prismaService.notification.delete({
				where: { id: notificationId }
			})

			return { success: true, message: 'Notification deleted' }
		} catch (error) {
			return { success: false, message: 'Failed to delete notification' }
		}
	}

	public async deleteAllNotifications(userId: string) {
		try {
			await this.prismaService.notification.deleteMany({
				where: {
					accountId: userId
				}
			})

			return { success: true, message: 'All notifications deleted' }
		} catch (error) {
			return { success: false, message: 'Failed to delete notifications' }
		}
	}
}
