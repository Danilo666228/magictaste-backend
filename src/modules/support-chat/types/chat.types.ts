import { Account } from 'prisma/generated'

export interface Message {
	id?: string
	message: string
	isRead?: boolean
	sender: Account
	receiver: Account
	createdAt: Date
	updatedAt: Date
}

export interface ChatMessageDto {
	content: string
	sender: Account
	receiver: Account
	createdAt: Date
	updatedAt: Date
}

export interface ActiveChat {
	account: Account
	status: 'new' | 'active' | 'finished'
	lastMessage: string
	unreadCount: number
	createdAt: Date
	updatedAt: Date
	assignedAdmin?: Account
}

export interface Ticket {
	id: string
	account: Account
	status: 'new' | 'active' | 'closed' | 'resolved'
	priority?: 'low' | 'medium' | 'high'
	category?: string
	title?: string
	description?: string
	messages?: Message[]
	assignedAdmin?: Account
	assignedAt?: Date
	resolvedAt?: Date
	resolution?: string
	createdAt: Date
	updatedAt: Date
}

export interface SupportFeedback {
	id?: string
	userId: string
	rating: number
	comment?: string
	createdAt: Date
}

export interface SupportChatSession {
	id?: string
	userId: string
	adminId: string
	startedAt: Date
	finishedAt: Date
	resolution?: string
	issue?: string
	feedbackId?: string
}

export interface PendingUserInfo {
	user: Account
	waitingSince: Date
	waitTime: number
	position: number
	priority: 'low' | 'medium' | 'high'
	issue?: string
}
