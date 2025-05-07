import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NotificationsService, ToastMessage } from './notifications.service'

@WebSocketGateway({
	cors: {
		origin: '*',
		credentials: true
	},
	path: '/api/notifications/socket.io',
	transports: ['websocket', 'polling']
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server

	constructor(private readonly notificationsService: NotificationsService) {}

	onModuleInit() {
		this.notificationsService.setServer(this.server)
	}

	@SubscribeMessage('getNotifications')
	public async getNotifications(client: Socket) {
		const userId = client.handshake.query.userId as string

		const notifications = await this.notificationsService.getAllNotificationsByAccountId(userId)
		client.emit('notifications', notifications)
	}

	@SubscribeMessage('markAsRead')
	async markAsRead(client: Socket, payload: { notificationId: string }) {
		const userId = client.handshake.query.userId as string
		if (!userId) {
			client.emit('notificationsError', { message: 'User ID is required' })
			return
		}

		const result = await this.notificationsService.markNotificationAsRead(payload.notificationId, userId)
		if (result.success) {
			// Отправляем обновленный список уведомлений
			const notifications = await this.notificationsService.getAllNotificationsByAccountId(userId)
			client.emit('notifications', notifications)
		}
		client.emit('markAsReadResult', result)
	}

	@SubscribeMessage('markAllAsRead')
	async markAllAsRead(client: Socket) {
		const userId = client.handshake.query.userId as string
		if (!userId) {
			client.emit('notificationsError', { message: 'User ID is required' })
			return
		}

		const result = await this.notificationsService.markAllNotificationsAsRead(userId)
		if (result.success) {
			// Отправляем обновленный список уведомлений
			const notifications = await this.notificationsService.getAllNotificationsByAccountId(userId)
			client.emit('notifications', notifications)
		}
		client.emit('markAllAsReadResult', result)
	}

	@SubscribeMessage('deleteNotification')
	async deleteNotification(client: Socket, payload: { notificationId: string }) {
		const userId = client.handshake.query.userId as string
		if (!userId) {
			client.emit('notificationsError', { message: 'User ID is required' })
			return
		}

		const result = await this.notificationsService.deleteNotification(payload.notificationId, userId)
		if (result.success) {
			// Отправляем обновленный список уведомлений
			const notifications = await this.notificationsService.getAllNotificationsByAccountId(userId)
			client.emit('notifications', notifications)
		}
		client.emit('deleteNotificationResult', result)
	}

	@SubscribeMessage('deleteAllNotifications')
	async deleteAllNotifications(client: Socket) {
		const userId = client.handshake.query.userId as string
		if (!userId) {
			client.emit('notificationsError', { message: 'User ID is required' })
			return
		}

		const result = await this.notificationsService.deleteAllNotifications(userId)
		if (result.success) {
			// Отправляем пустой список уведомлений
			client.emit('notifications', [])
		}
		client.emit('deleteAllNotificationsResult', result)
	}

	async getAllNotifications(userId: string) {
		const notifications = await this.notificationsService.getAllNotificationsByAccountId(userId)
		this.server.to(userId).emit('notifications', notifications)
	}

	async handleConnection(client: Socket) {
		try {
			const userId = client.handshake.query.userId as string
			const temporaryId = client.handshake.query.temporaryId as string

			if (!userId && !temporaryId) {
				console.error('No userId or temporaryId provided')
				client.disconnect()
				return
			}

			// Регистрируем подключение в сервисе
			this.notificationsService.addUserSocket(userId || null, client.id, temporaryId)

			client.emit('connected', {
				status: 'connected',
				temporaryId: temporaryId || null,
				userId: userId || null
			})

			// console.log(`Client connected: ${client.id}, UserId: ${userId || 'anonymous'}, TemporaryId: ${temporaryId}`)
		} catch (error) {
			// console.error('WebSocket connection error:', error)
			client.disconnect()
		}
	}

	handleDisconnect(client: Socket) {
		const userId = client.handshake.query.userId as string
		const temporaryId = client.handshake.query.temporaryId as string
		this.notificationsService.removeUserSocket(userId || null, client.id, temporaryId)
	}

	// Метод для отправки уведомления конкретному пользователю
	async sendToUser(userId: string, message: ToastMessage) {
		const sockets = this.notificationsService.getUserSockets(userId)
		sockets.forEach(socketId => {
			this.server.to(socketId).emit('toast', message)
		})
	}

	// Метод для отправки уведомления всем пользователям
	broadcast(message: ToastMessage) {
		this.server.emit('toast', message)
	}

	// Добавьте этот метод для обновления списка уведомлений после создания нового
	async updateNotificationsForUser(userId: string) {
		const notifications = await this.notificationsService.getAllNotificationsByAccountId(userId)
		const sockets = this.notificationsService.getUserSockets(userId)

		sockets.forEach(socketId => {
			this.server.to(socketId).emit('notifications', notifications)
		})
	}
}
