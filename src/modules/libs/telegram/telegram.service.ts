import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AccountEntity } from '@/core/entities/account.entity'
import { plainToInstance } from 'class-transformer'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { TokenTypes } from 'prisma/generated'
import { Context, Telegraf } from 'telegraf'
import { BUTTONS } from './telegram.buttons'
import { MESSAGES } from './telegram.message'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
		this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}

	@Start()
	public async onStart(@Ctx() ctx: any) {
		const chatId = ctx.chat.id.toString()
		const token = ctx.message.text.split(' ')[1]

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenTypes.TELEGRAM_AUTH
				}
			})

			const hasExiped = new Date(authToken.expiresIn) < new Date()

			if (!authToken) {
				await ctx.replyWithHTML(MESSAGES.invalidToken)
			}

			if (hasExiped) {
				await ctx.replyWithHTML(MESSAGES.invalidToken)
			}

			await this.connectTelegram(authToken.accountId, chatId)

			await this.prismaService.token.delete({
				where: {
					id: authToken.id,
					type: TokenTypes.TELEGRAM_AUTH
				}
			})

			await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess)
		} else {
			const account = await this.findUserByChatId(chatId)

			if (account) {
				await ctx.replyWithHTML(MESSAGES.hello(account), BUTTONS.profile)
			} else {
				await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.auth)
			}
		}
	}

	@Command('profile')
	@Action('profile')
	public async onProfile(@Ctx() ctx: Context) {
		const chatId = ctx.chat.id.toString()
		const account = await this.findUserByChatId(chatId)

		await ctx.replyWithHTML(MESSAGES.profile(account), BUTTONS.updateProfile)
	}

	public async sendTwoFactorEmailCode(chatId: string, code: string) {
		return await this.telegram.sendMessage(chatId, MESSAGES.twoFactorEmailCode(code), {
			parse_mode: 'HTML'
		})
	}

	public async sendEnableTwoFactorEmail(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.enableTwoFactorEmail, {
			parse_mode: 'HTML'
		})
	}
	public async sendEnableTwoFactorTotp(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.enabletwoFactorTotp, {
			parse_mode: 'HTML'
		})
	}
	public async sendDisableTwoFactorEmail(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.disableTwoFactorEmail, {
			parse_mode: 'HTML'
		})
	}

	private async findUserByChatId(chatId: string) {
		const account = await this.prismaService.account.findFirst({
			where: {
				accountSettings: {
					telegramId: chatId
				}
			}
		})

		return plainToInstance(AccountEntity, account)
	}
	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.accountSettings.updateMany({
			where: { accountId: userId },
			data: { telegramId: chatId }
		})
	}
}
