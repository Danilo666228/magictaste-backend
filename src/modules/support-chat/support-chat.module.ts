import { PrismaService } from '@/core/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { SupportChatGateway } from './support-chat.gateway'
import { SupportChatService } from './support-chat.service'

@Module({
	providers: [SupportChatGateway, SupportChatService, PrismaService]
})
export class SupportChatModule {}
