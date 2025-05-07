import { AccountEntity } from '@/core/entities/account.entity'
import { PrismaService } from '@/core/prisma/prisma.service'
import { NotificationsService } from '@/modules/notifications/notifications.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode'
import { EnableTotpDto } from './dto/enableTotp.dto'
import { TelegramService } from '@/modules/libs/telegram/telegram.service'
import { Account } from 'prisma/generated'

const TOTP_CONFIG = {
	issuer: 'MagicTaste',
	algorithm: 'SHA256',
	digits: 6,
	period: 30,
	window: 1
} as const

@Injectable()
export class TotpService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService,
		private readonly telegramService: TelegramService
	) {}

	private createTotpInstance(secret: string, email: string) {
		return new TOTP({
			...TOTP_CONFIG,
			label: email,
			secret
		})
	}

	public async generateTotpSecret(account: AccountEntity) {
		const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24)
		const totp = this.createTotpInstance(secret, account.email)
		const otpauthUrl = totp.toString()

		const qrCodeUrl = await QRCode.toDataURL(otpauthUrl, {})
		const remainingSeconds = TOTP_CONFIG.period - (Math.floor(Date.now() / 1000) % TOTP_CONFIG.period)

		return { qrCodeUrl, secret, remainingSeconds }
	}

	public async enableTotp(account: AccountEntity, dto: EnableTotpDto) {
		if (!dto.secret || !dto.pin) {
			await this.notificationsService.create({
				accountId: account.id,
				title: 'Ошибка при включении 2FA TOTP',
				message: 'Отсутствует секрет или пин-код',
				type: 'error'
			})

			throw new BadRequestException('Отсутствует секрет или пин-код')
		}

		const totp = this.createTotpInstance(dto.secret, account.email)
		const delta = totp.validate({
			token: dto.pin,
			window: TOTP_CONFIG.window
		})

		if (delta === null) {
			await this.notificationsService.create({
				accountId: account.id,
				title: 'Ошибка при включении 2FA TOTP',
				message: 'Неверный пин-код',
				type: 'error'
			})
			throw new BadRequestException('Неверный пин-код')
		}

		await this.prismaService.accountSettings.update({
			where: { accountId: account.id },
			data: {
				isTwoFactorTotpEnabled: true,
				totpSecret: dto.secret
			}
		})

		await this.notificationsService.create({
			accountId: account.id,
			title: 'Включение 2FA TOTP',
			message: 'Двухфакторная аутентификация TOTP успешно включена',
			type: 'success'
		})

		if (account.accountSettings.telegramNotification) {
			await this.telegramService.sendEnableTwoFactorTotp(account.accountSettings.telegramId)
		}

		return true
	}

	public async verifyTotpToken(account: Account, token: string): Promise<boolean> {
		const accountSettings = await this.prismaService.accountSettings.findUnique({ where: { accountId: account.id } })
		if (!accountSettings.totpSecret || !accountSettings.isTwoFactorTotpEnabled) {
			throw new BadRequestException('TOTP не активирован для данного аккаунта')
		}

		const totp = this.createTotpInstance(accountSettings.totpSecret, account.email)
		const delta = totp.validate({
			token,
			window: TOTP_CONFIG.window
		})

		return delta !== null
	}

	public async disableTotp(account: AccountEntity) {
		await this.prismaService.accountSettings.update({
			where: { accountId: account.id },
			data: { isTwoFactorTotpEnabled: false, totpSecret: null }
		})

		await this.notificationsService.create({
			accountId: account.id,
			title: 'Выключение 2FA TOTP',
			message: 'Двухфакторная аутентификация TOTP успешно выключена',
			type: 'success'
		})

		return true
	}
}
