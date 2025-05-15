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
	}
	// path: '/api/support-chat/socket.io'
})
export class SupportChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server

	constructor(private readonly supportChatService: SupportChatService) {}

	public async handleConnection(client: Socket) {
		try {
			const userId = client.handshake.auth.userId
			if (!userId) {
				client.disconnect()
				return
			}

			this.supportChatService.userConnected(userId, client.id)
		} catch (error) {
			client.disconnect()
		}
	}

	handleDisconnect(client: Socket) {
		this.supportChatService.userDisconnected(client.id)
	}

	@SubscribeMessage('sendMessage')
	public async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: ChatMessageDto) {
		try {
			const savedMessage = await this.supportChatService.saveMessage(data)
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
	public async handleStartChat(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
		const chat = await this.supportChatService.startChat(data.userId)
		const supportUsers = await this.supportChatService.getSupportUsers()
		for (const support of supportUsers) {
			const supportSocketId = this.supportChatService.getSocketId(support.id)
			if (supportSocketId) {
				this.server.to(supportSocketId).emit('newChatRequest', chat)
			}
		}
		return { success: true, chat }
	}

	@SubscribeMessage('assignChat')
	public async handleAssignChat(
		@MessageBody()
		data: {
			userId: string
			supportId: string
		},
		@ConnectedSocket() client: Socket
	) {
		const chat = await this.supportChatService.assignChatToSupport(data.userId, data.supportId)

		// Отправляем уведомление пользователю о назначении администратора
		const userSocketId = this.supportChatService.getSocketId(data.userId)
		if (userSocketId) {
			this.server.to(userSocketId).emit('supportAssigned', {
				support: chat.assignedAdmin
			})
		}
		return { success: true, chat }
	}

	@SubscribeMessage('finishChat')
	public async handleFinishChat(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
		await this.supportChatService.finishChat(data.userId)
		// Уведомляем пользователя о завершении чата
		const userSocketId = this.supportChatService.getSocketId(data.userId)
		if (userSocketId) {
			this.server.to(userSocketId).emit('chatFinished')
		}
		return { success: true, message: 'Chat finished successfully' }
	}

	@SubscribeMessage('getActiveChats')
	public async handleGetActiveChats() {
		const chats = await this.supportChatService.getActiveChats()
		return { success: true, chats }
	}

	@SubscribeMessage('getChatHistory')
	public async handleGetChatHistory(@MessageBody() data: { userId: string }) {
		const history = await this.supportChatService.getChatHistory(data.userId)
		return { success: true, history }
	}
}
