import { Account } from 'prisma/generated'

export class ChatMessageDto {
	message: string
	sender: Account
	receiver: Account
	createdAt: Date
	updatedAt: Date
}
