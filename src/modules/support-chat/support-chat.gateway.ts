import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SupportChatService } from './support-chat.service'
import { ChatMessageDto } from './types/chat.types'

@WebSocketGateway({
	cors: {
		origin: '*'
	},
	path: '/api/support-chat/socket.io'
})
export class SupportChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server

	constructor(private readonly supportChatService: SupportChatService) {}

	async handleConnection(client: Socket) {
		try {
			const userId = client.handshake.auth.userId
			if (!userId) {
				client.disconnect()
				return
			}

			this.supportChatService.userConnected(userId, client.id)
			console.log(`Client connected: ${client.id}, userId: ${userId}`)
		} catch (error) {
			console.error('Connection error:', error)
			client.disconnect()
		}
	}

	handleDisconnect(client: Socket) {
		this.supportChatService.userDisconnected(client.id)
		console.log(`Client disconnected: ${client.id}`)
	}

	@SubscribeMessage('sendMessage')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: ChatMessageDto) {
		try {
			const savedMessage = await this.supportChatService.saveMessage(data)

			// Отправляем сообщение получателю
			const receiverSocketId = this.supportChatService.getSocketId(data.receiver.id)
			if (receiverSocketId) {
				this.server.to(receiverSocketId).emit('newMessage', savedMessage)
			}

			return { success: true, message: savedMessage }
		} catch (error) {
			console.error('Error sending message:', error)
			return { success: false, error: 'Failed to send message' }
		}
	}

	@SubscribeMessage('startChat')
	async handleStartChat(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
		try {
			const chat = await this.supportChatService.startChat(data.userId)

			// Уведомляем всех администраторов о новом чате
			const supportUsers = await this.supportChatService.getSupportUsers()
			for (const support of supportUsers) {
				const supportSocketId = this.supportChatService.getSocketId(support.id)
				if (supportSocketId) {
					this.server.to(supportSocketId).emit('newChatRequest', chat)
				}
			}

			return { success: true, chat }
		} catch (error) {
			console.error('Error starting chat:', error)
			return { success: false, error: 'Failed to start chat' }
		}
	}

	@SubscribeMessage('assignChat')
	async handleAssignChat(@MessageBody() data: { userId: string; supportId: string }, @ConnectedSocket() client: Socket) {
		try {
			const chat = await this.supportChatService.assignChatToSupport(data.userId, data.supportId)

			// Отправляем уведомление пользователю о назначении администратора
			const userSocketId = this.supportChatService.getSocketId(data.userId)
			if (userSocketId) {
				this.server.to(userSocketId).emit('supportAssigned', {
					support: chat.assignedAdmin
				})
			}

			return { success: true, chat }
		} catch (error) {
			console.error('Error assigning chat:', error)
			return { success: false, error: error.message }
		}
	}

	@SubscribeMessage('finishChat')
	async handleFinishChat(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
		try {
			const result = await this.supportChatService.finishChat(data.userId)

			// Уведомляем пользователя о завершении чата
			const userSocketId = this.supportChatService.getSocketId(data.userId)
			if (userSocketId) {
				this.server.to(userSocketId).emit('chatFinished')
			}

			return { success: true, message: 'Chat finished successfully' }
		} catch (error) {
			console.error('Error finishing chat:', error)
			return { success: false, error: 'Failed to finish chat' }
		}
	}

	@SubscribeMessage('getActiveChats')
	async handleGetActiveChats() {
		try {
			const chats = await this.supportChatService.getActiveChats()
			return { success: true, chats }
		} catch (error) {
			console.error('Error getting active chats:', error)
			return { success: false, error: 'Failed to get active chats' }
		}
	}

	@SubscribeMessage('getChatHistory')
	async handleGetChatHistory(@MessageBody() data: { userId: string }) {
		try {
			const history = await this.supportChatService.getChatHistory(data.userId)
			return { success: true, history }
		} catch (error) {
			console.error('Error getting chat history:', error)
			return { success: false, error: 'Failed to get chat history' }
		}
	}
}
