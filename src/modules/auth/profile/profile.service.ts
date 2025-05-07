import { PrismaService } from '@/core/prisma/prisma.service'
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { AccountService } from '../account/account.service'
import { AccountEntity } from '@/core/entities/account.entity'
import { NotificationsService } from '@/modules/notifications/notifications.service'
import { TwoFactorEmailDto } from './dto/two-factor-email.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { generateToken } from '@/shared/common/generate-token'
import { Account, PrismaPromise, TokenTypes } from 'prisma/generated'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { hash, verify } from 'argon2'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { StorageService } from '@/modules/libs/storage/storage.service'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly accountService: AccountService,
		private readonly notificationsService: NotificationsService,
		private readonly storageService: StorageService
	) {}

	public async updateTwoFactorEmailSettings(account: AccountEntity, dto: TwoFactorEmailDto) {
		const updatedSettings = await this.prismaService.accountSettings.update({
			where: {
				accountId: account.id
			},
			data: {
				isTwoFactorEmailEnabled: dto.isTwoFactorEmailEnabled
			}
		})

		await this.notificationsService.create({
			accountId: account.id,
			title: 'Двухфакторная аутентификация',
			message: updatedSettings.isTwoFactorEmailEnabled
				? 'Двухфакторная аутентификация включена'
				: 'Двухфакторная аутентификация выключена',
			type: 'success',
			save: true
		})

		return {
			success: true,
			settings: updatedSettings,
			message: updatedSettings.isTwoFactorEmailEnabled
				? 'Двухфакторная аутентификация включена'
				: 'Двухфакторная аутентификация выключена'
		}
	}

	public async changeNotificationSettings(dto: NotificationSettingsDto, account: AccountEntity) {
		const accountSettings = await this.prismaService.accountSettings.update({
			where: { accountId: account.id },
			data: {
				siteNotification: dto.siteNotifications,
				telegramNotification: dto.telegramNotifications
			}
		})

		if (accountSettings.telegramNotification && !accountSettings.telegramId) {
			const telegramAuthToken = await generateToken(this.prismaService, account, TokenTypes.TELEGRAM_AUTH)

			return { accountSettings, token: telegramAuthToken.token }
		}

		this.notificationsService.create({
			accountId: account.id,
			title: 'Обновление уведомлений',
			message: 'Уведомления успешно обновлены',
			type: 'success'
		})
		return { accountSettings }
	}
	public async updatePassword(account: AccountEntity, dto: UpdatePasswordDto) {
		const isOldPasswordValid = await verify(account.password, dto.oldPassword)

		if (!isOldPasswordValid) {
			this.notificationsService.create({
				accountId: account.id,
				title: 'Обновление пароля',
				message: 'Старый пароль неверный',
				type: 'error'
			})
			throw new BadRequestException('Старый пароль неверный')
		}

		if (dto.newPassword === dto.oldPassword) {
			this.notificationsService.create({
				accountId: account.id,
				title: 'Обновление пароля',
				message: 'Новый пароль не может быть таким же, как старый',
				type: 'error'
			})
			throw new BadRequestException('Новый пароль не может быть таким же, как старый')
		}

		await this.prismaService.account.update({
			where: {
				id: account.id
			},
			data: { password: await hash(dto.newPassword) }
		})

		await this.notificationsService.create({
			accountId: account.id,
			title: 'Обновление пароля',
			message: 'Пароль успешно обновлен',
			type: 'success'
		})
		return true
	}
	public async updateProfile(account: AccountEntity, dto: UpdateProfileDto) {
		const existEmail = await this.prismaService.account.findUnique({
			where: { email: dto.email }
		})
		const existUserName = await this.prismaService.account.findUnique({ where: { userName: dto.userName } })

		if (existEmail && existEmail.id !== account.id) {
			await this.notificationsService.create({
				accountId: account.id,
				title: 'Обновление профиля',
				message: 'Пользователь с таким email уже существует',
				type: 'error'
			})
			throw new ConflictException('Пользователь с таким email уже существует')
		}
		if (existUserName && existUserName.id !== account.id) {
			await this.notificationsService.create({
				accountId: account.id,
				title: 'Обновление профиля',
				message: 'Пользователь с таким логином уже существует',
				type: 'error'
			})
			throw new ConflictException('Пользователь с таким логином уже существует')
		}

		await this.prismaService.account.update({
			where: {
				id: account.id
			},
			data: {
				userName: dto.userName,
				email: dto.email
			}
		})

		await this.notificationsService.create({
			accountId: account.id,
			title: 'Обновление профиля',
			message: 'Профиль успешно обновлен',
			type: 'success'
		})
		return true
	}
	public async updateAvatar(account: Account, file: Express.Multer.File): Promise<boolean> {
		if (account.picture) {
			await this.storageService.remove(account.picture)
		}

		const fileName = `/accounts/${account.id}/avatar/${file.originalname.split('.')[0]}.webp`

		await this.storageService.uploadImage({
			buffer: file.buffer,
			key: `/accounts/${account.id}/avatar/${file.originalname.split('.')[0]}.webp`,
			contentType: 'image/webp'
		})

		await this.prismaService.account.update({
			where: {
				id: account.id
			},
			data: {
				picture: fileName
			}
		})
		await this.notificationsService.create({
			accountId: account.id,
			title: 'Обновление аватара',
			message: 'Аватар успешно обновлен',
			type: 'success'
		})

		return true
	}
	public async removeAvatar(account: Account): Promise<boolean> {
		if (!account.picture) {
			return
		}

		await this.storageService.remove(account.picture)

		await this.prismaService.account.update({
			where: {
				id: account.id
			},
			data: {
				picture: null
			}
		})

		await this.notificationsService.create({
			accountId: account.id,
			title: 'Удаление аватара',
			message: 'Ваш аватар успешно удалён',
			type: 'success'
		})

		return true
	}
}
