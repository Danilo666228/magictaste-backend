import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { ActiveChat, ChatMessageDto } from './types/chat.types'
import { NotificationsService } from '@/modules/notifications/notifications.service'

@Injectable()
export class SupportChatService {
	private connectedUsers = new Map<string, string>() // userId -> socketId
	private activeChats = new Map<string, ActiveChat>()

	constructor(
		private prismaService: PrismaService,
		private readonly notification: NotificationsService
	) {}

	public userConnected(userId: string, socketId: string) {
		this.connectedUsers.set(userId, socketId)
	}

	public userDisconnected(socketId: string) {
		for (const [userId, connSocketId] of this.connectedUsers.entries()) {
			if (connSocketId === socketId) {
				this.connectedUsers.delete(userId)
				break
			}
		}
	}

	public async saveMessage(messageData: ChatMessageDto) {
		return this.prismaService.supportMessage.create({
			data: {
				message: messageData.content,
				senderId: messageData.sender.id,
				receiverId: messageData.receiver.id,
				createdAt: messageData.createdAt,
				updatedAt: messageData.updatedAt
			}
		})
	}

	public async getChatHistory(userId: string) {
		return this.prismaService.supportMessage.findMany({
			where: {
				OR: [{ senderId: userId }, { receiverId: userId }]
			},
			include: {
				sender: true,
				receiver: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})
	}

	public getConnectedUsers() {
		return Array.from(this.connectedUsers.keys())
	}

	public getSocketId(userId: string) {
		return this.connectedUsers.get(userId)
	}

	public async getSupportUsers() {
		return this.prismaService.account.findMany({
			where: {
				roles: {
					some: {
						role: {
							name: 'SUPPORT'
						}
					}
				}
			}
		})
	}

	public async startChat(userId: string) {
		try {
			const user = await this.prismaService.account.findUnique({
				where: { id: userId }
			})

			if (!user) {
				throw new Error('User not found')
			}

			const existingChat = this.activeChats.get(userId)
			if (existingChat) {
				return existingChat
			}

			const newChat: ActiveChat = {
				account: user,
				status: 'new',
				lastMessage: '',
				unreadCount: 0,
				createdAt: new Date(),
				updatedAt: new Date()
			}

			this.activeChats.set(userId, newChat)

			await this.notifySupportAboutNewChat(userId, user.userName)

			return newChat
		} catch (error) {
			console.error('[Support Service] Error starting chat:', error)
			throw error
		}
	}

	private async notifySupportAboutNewChat(userId: string, userName: string) {
		const supportUsers = await this.getSupportUsers()

		for (const support of supportUsers) {
			const supportSocketId = this.getSocketId(support.id)
			if (supportSocketId) {
			}
		}
	}

	public async assignChatToSupport(userId: string, supportId: string) {
		const chat = this.activeChats.get(userId)

		if (!chat) {
			throw new Error('Chat not found')
		}

		const support = await this.prismaService.account.findUnique({
			where: { id: supportId }
		})

		if (!support) {
			throw new Error('Support user not found')
		}

		chat.status = 'active'
		chat.assignedAdmin = support
		chat.updatedAt = new Date()

		this.activeChats.set(userId, chat)

		const userSocketId = this.getSocketId(userId)
		if (userSocketId) {
		}

		return chat
	}

	public async finishChat(userId: string) {
		const chat = this.activeChats.get(userId)

		if (!chat) {
			throw new Error('Chat not found')
		}

		chat.status = 'finished'
		chat.updatedAt = new Date()

		this.activeChats.delete(userId)

		return { success: true, message: 'Chat finished successfully' }
	}

	public async getActiveChats() {
		const activeChatsArray = Array.from(this.activeChats.values())
			.filter(chat => chat.status !== 'finished')
			.sort((a, b) => {
				// Сначала новые чаты
				if (a.status === 'new' && b.status !== 'new') return -1
				if (a.status !== 'new' && b.status === 'new') return 1
				return b.createdAt.getTime() - a.createdAt.getTime()
			})

		return activeChatsArray
	}

	public async getUserChat(userId: string) {
		return this.activeChats.get(userId)
	}
}
