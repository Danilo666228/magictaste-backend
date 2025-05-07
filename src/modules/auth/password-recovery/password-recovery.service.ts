import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { TokenTypes } from 'prisma/generated'

import { PrismaService } from '@/core/prisma/prisma.service'

import { generateToken } from '@/shared/common/generate-token'
import { getSessionMetadata } from '@/shared/utils/sessiom.metadata'
import type { Request } from 'express'
import { MailService } from '../../../shared/services/mail/mail.service'
import { AccountService } from '../account/account.service'
import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { NotificationsService } from '@/modules/notifications/notifications.service'
@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly accountService: AccountService,
		private readonly mailService: MailService,
		private readonly notificationsService: NotificationsService
	) {}

	public async resetPassword(dto: ResetPasswordDto, request: Request, userAgent: string) {
		const existingUser = await this.prismaService.account.findUnique({
			where: { email: dto.email },
			include: this.accountService.INCLUDE_QUERY
		})
		const metadata = getSessionMetadata(request, userAgent)
		if (!existingUser) {
			throw new NotFoundException('Пользователь не найден. Пожалуйста, проверьте адрес почты и повторите попытку.')
		}

		const passwordResetToken = await generateToken(this.prismaService, existingUser, TokenTypes.RESET_PASSWORD)

		await this.mailService.sendResetPasswordEmail(existingUser.email, passwordResetToken.token, metadata)

		return true
	}

	public async changePassword(dto: NewPasswordDto, token: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				token,
				type: TokenTypes.RESET_PASSWORD
			},
			include: {
				account: true
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден. Пожалуйста, проверьте введенные данные.')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Токен истек. Пожалуйста, повторите попытку.')
		}

		const existingUser = await this.prismaService.account.findUnique({ where: { email: existingToken.account.email } })

		if (!existingUser) {
			throw new NotFoundException('Пользователь не найден. Пожалуйста, проверьте введенные данные.')
		}

		await this.prismaService.account.update({
			where: { id: existingUser.id },
			data: { password: await hash(dto.password) }
		})

		await this.notificationsService.create({
			accountId: existingUser.id,
			title: 'Сброс пароля',
			message: 'Пароль успешно сброшен'
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenTypes.RESET_PASSWORD
			}
		})

		return true
	}
}
