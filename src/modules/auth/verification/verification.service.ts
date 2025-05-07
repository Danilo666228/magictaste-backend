import { PrismaService } from '@/core/prisma/prisma.service'

import { generateToken } from '@/shared/common/generate-token'
import { MailService } from '@/shared/services/mail/mail.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Request } from 'express'
import { Account, TokenTypes } from 'prisma/generated'

import { AccountEntity } from '@/core/entities/account.entity'
import { getSessionMetadata } from '@/shared/utils/sessiom.metadata'
import { AccountService } from '../account/account.service'
import { SessionService } from '../session/session.service'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService,
		private readonly accountService: AccountService
	) {}

	public async verifyEmail(request: Request, token: string, userAgent: string) {
		const metadata = getSessionMetadata(request, userAgent)
		const existToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenTypes.VERIFY_EMAIL
			}
		})

		if (!token) {
			throw new BadRequestException('Ошибка верификации. Отсутствует токен.')
		}

		if (!existToken) {
			throw new NotFoundException('Токен не найден.')
		}

		const hasExpired = new Date(existToken.expiresIn) < new Date()
		if (hasExpired) {
			throw new BadRequestException('Токен истек. Пожалуйста, запросите новый токен.')
		}

		const existingUser = await this.prismaService.account.findUnique({ where: { id: existToken.accountId } })

		if (!existingUser) {
			throw new NotFoundException('Пользователь не найден. Пожалуйста, проверьте введенные данные.')
		}

		await this.prismaService.accountSettings.update({
			where: { accountId: existingUser.id },
			data: { isVerifiedEmail: true }
		})

		await this.prismaService.token.delete({
			where: {
				id: existToken.id,
				type: TokenTypes.VERIFY_EMAIL
			}
		})

		await this.sessionService.saveSession(request, existingUser, metadata)
		return { message: 'Ваш аккаунт успешно верифицирован.' }
	}

	public async sendVerificationToken(user: Account, request: Request, userAgent: string) {
		const verificationToken = await generateToken(this.prismaService, user, TokenTypes.VERIFY_EMAIL)

		const metadata = getSessionMetadata(request, userAgent)

		await this.mailService.sendVerifyEmail(user.email, verificationToken.token, metadata)

		return true
	}
}
