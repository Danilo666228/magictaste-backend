import { PrismaService } from '@/core/prisma/prisma.service'
import { generateToken } from '@/shared/common/generate-token'
import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Account, TokenTypes } from 'prisma/generated'
import { MailService } from '../../../shared/services/mail/mail.service'
import { AccountEntity } from '@/core/entities/account.entity'
import { TelegramService } from '@/modules/libs/telegram/telegram.service'
import { AccountService } from '../account/account.service'

@Injectable()
export class TwoFactorService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly telegramService: TelegramService,
		private readonly accountService: AccountService
	) {}

	public async validateTwoFactorToken(account: Account, code: string) {
		const existToken = await this.prismaService.token.findFirst({
			where: {
				accountId: account.id,
				type: TokenTypes.TWO_FACTOR_EMAIL
			}
		})

		if (!existToken) {
			throw new NotFoundException('Код не найден. Пожалуйста, проверьте введенные данные.')
		}

		if (existToken.token !== code) {
			throw new BadRequestException('Неверный код. Пожалуйста, проверьте введенные данные.')
		}
		const hasExpired = new Date(existToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Код истек. Пожалуйста, запросите новый токен.')
		}

		await this.prismaService.token.delete({
			where: {
				id: existToken.id,
				type: TokenTypes.TWO_FACTOR_EMAIL
			}
		})

		return true
	}

	public async sendTwoFactorToken(account: Account, metadata: SessionMetadata) {
		const twoFactorToken = await generateToken(this.prismaService, account, TokenTypes.TWO_FACTOR_EMAIL, false)
		const currentAccount = await this.accountService.findAccountById(account.id)

		if (currentAccount.accountSettings.telegramNotification) {
			await this.telegramService.sendTwoFactorEmailCode(currentAccount.accountSettings.telegramId, twoFactorToken.token)
		}
		await this.mailService.sendTwoFactorEmail(account.email, twoFactorToken.token, metadata)

		return true
	}
}
