import { getSessionMetadata } from '@/shared/utils/sessiom.metadata'
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { verify } from 'argon2'
import { Request } from 'express'
import { NotificationsService } from '../notifications/notifications.service'
import { AccountService } from './account/account.service'
import { SignInDto } from './account/dto/sign-in.dto'
import { SignUpDto } from './account/dto/sign-up.dto'
import { SessionService } from './session/session.service'
import { TotpService } from './totp/totp.service'
import { TwoFactorService } from './two-factor/two-factor.service'
import { VerificationService } from './verification/verification.service'
import { PrismaService } from '@/core/prisma/prisma.service'
import { LoyaltyService } from '../loyalty/loyalty.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly verificationService: VerificationService,
		private readonly twoFactorService: TwoFactorService,
		private readonly sessionService: SessionService,
		private readonly accountService: AccountService,
		private readonly notificationsService: NotificationsService,
		private readonly totpService: TotpService,
		private readonly prismaService: PrismaService,
		private readonly loyaltyLevel: LoyaltyService
	) {}

	public async signUp(dto: SignUpDto, request: Request, userAgent: string) {
		const isExistUser = await this.prismaService.account.findUnique({ where: { email: dto.email } })
		if (isExistUser) {
			throw new ConflictException('Регистрация не удалась. Пользователь с такой почтой уже существует.')
		}

		const candidate = await this.accountService.createAccount(dto)

		await this.verificationService.sendVerificationToken(candidate, request, userAgent)

		await this.loyaltyLevel.initializeAccountLoyalty(candidate.id)

		await this.notificationsService.sendToAnonymous(request.temporaryId, {
			type: 'success',
			title: 'Вы успешно зарегистрировались',
			message: 'Пожалуйста, подтвердите вашу почту, чтобы войти в систему. Сообщение отправлено на ваш email.'
		})

		return true
	}

	public async signIn(dto: SignInDto, request: Request, userAgent: string) {
		const metadata = getSessionMetadata(request, userAgent)
		const temporaryId = request.headers['temporary-id'] as string
		const currentIp = request.ip

		if (request.session.accountId) {
			await this.notificationsService.sendToAnonymous(temporaryId, {
				type: 'error',
				title: 'Вы уже вошли в систему',
				message: 'Пожалуйста, выйдите из системы, чтобы войти в систему с другой учетной записью.'
			})
			throw new BadRequestException('Вы уже вошли в систему')
		}

		const account = await this.prismaService.account.findUnique({
			where: { email: dto.email },
			include: this.accountService.INCLUDE_QUERY
		})
		if (!account) {
			await this.notificationsService.sendToAnonymous(temporaryId, {
				type: 'error',
				title: 'Пользователь не найден',
				message: 'Пожалуйста, проверьте введенные данные.'
			})
			throw new NotFoundException('Пользователь не найден. Пожалуйста, проверьте введенные данные.')
		}

		const isValidPassword = await verify(account.password, dto.password)
		if (!isValidPassword) {
			await this.notificationsService.sendToAnonymous(temporaryId, {
				type: 'error',
				title: 'Неверный пароль',
				message: 'Пожалуйста, проверьте введенные данные.'
			})
			throw new UnauthorizedException('Неверный пароль. Пожалуйста, проверьте введенные данные.')
		}

		if (!account.accountSettings.isVerifiedEmail) {
			await this.verificationService.sendVerificationToken(account, request, userAgent)
			await this.notificationsService.sendToAnonymous(temporaryId, {
				type: 'info',
				title: 'Почта не подтверждена',
				message: 'Пожалуйста, проверьте вашу почту и подтвердите адрес.'
			})
			throw new UnauthorizedException('Ваша почта не подтверждена. Пожалуйста, проверьте вашу почту и подтвердите адрес.')
		}

		const needsTotpVerification = account.accountSettings.isTwoFactorTotpEnabled
		const needsEmailVerification = account.accountSettings.isTwoFactorEmailEnabled

		if (!dto.totpCode && !dto.emailCode && (needsTotpVerification || needsEmailVerification)) {
			if (needsTotpVerification) {
				await this.notificationsService.sendToAnonymous(temporaryId, {
					type: 'info',
					title: 'Необходим код TOTP',
					message: 'Пожалуйста, введите код из приложения аутентификации.'
				})
			} else if (needsEmailVerification) {
				await this.twoFactorService.sendTwoFactorToken(account, metadata)
				await this.notificationsService.sendToAnonymous(temporaryId, {
					type: 'info',
					title: 'Необходим код подтверждения из email',
					message: 'Пожалуйста, введите код, отправленный на ваш email.'
				})
			}

			return {
				message: this.getAuthenticationMessage(needsTotpVerification, needsEmailVerification),
				requiredMethods: {
					totp: needsTotpVerification,
					email: needsEmailVerification
				}
			}
		}

		if (needsTotpVerification) {
			if (!dto.totpCode) {
				await this.notificationsService.sendToAnonymous(temporaryId, {
					type: 'info',
					title: 'Необходим код TOTP',
					message: 'Пожалуйста, введите код из приложения аутентификации.'
				})
				throw new UnauthorizedException('Необходим код TOTP')
			}
			const isValidTotp = await this.totpService.verifyTotpToken(account, dto.totpCode)
			if (!isValidTotp) {
				await this.notificationsService.sendToAnonymous(temporaryId, {
					type: 'error',
					title: 'Неверный код TOTP',
					message: 'Пожалуйста, проверьте введенные данные.'
				})
				throw new UnauthorizedException('Неверный код TOTP')
			}
		}

		if (needsEmailVerification) {
			if (!dto.emailCode) {
				await this.twoFactorService.sendTwoFactorToken(account, metadata)
				await this.notificationsService.sendToAnonymous(temporaryId, {
					type: 'info',
					title: 'Необходим код подтверждения из email',
					message: 'Пожалуйста, введите код, отправленный на ваш email.'
				})
				return {
					message: 'Введите код, отправленный на email',
					requiredMethods: {
						totp: false,
						email: true
					}
				}
			}

			try {
				await this.twoFactorService.validateTwoFactorToken(account, dto.emailCode)
			} catch (error) {
				await this.notificationsService.sendToAnonymous(temporaryId, {
					type: 'error',
					title: 'Неверный код подтверждения из email',
					message: 'Пожалуйста, проверьте введенные данные.'
				})
				throw new UnauthorizedException('Неверный код подтверждения из email')
			}
		}

		if (temporaryId) {
			const notificationSent = this.notificationsService.sendToAnonymous(temporaryId, {
				type: 'success',
				title: 'Авторизация',
				message: 'Вы успешно вошли в систему'
			})
			console.log(`Notification sent: ${notificationSent}`)
		}

		return await this.sessionService.saveSession(request, account, metadata)
	}

	private getAuthenticationMessage(needsTotp: boolean, needsEmail: boolean): string {
		if (needsTotp && needsEmail) {
			return 'Требуется код TOTP и код из email для входа'
		}
		if (needsTotp) {
			return 'Необходимо ввести код из приложения аутентификации'
		}
		return 'Проверьте вашу почту, требуется код от двухфакторной аутентификации'
	}

	public async logout(request: Request) {
		const accountId = request.session.accountId
		if (!accountId) {
			throw new UnauthorizedException('Пользователь не авторизован')
		}
		await Promise.all([this.sessionService.destroySession(request), this.sessionService.clearSession(request)])

		return true
	}

	// public async handleGoogleAuth(request: any) {
	// 	let account = await this.prismaService.account.findUnique({
	// 		where: { email: request.user.email },
	// 		include: this.accountService.INCLUDE_QUERY
	// 	})
	//
	// 	if (!account) {
	// 		account = await this.prismaService.account.create({
	// 			data: {
	// 				email: request.user.email,
	// 				userName: request.user.name,
	// 				password: '12313'
	// 			},
	// 			include: this.accountService.INCLUDE_QUERY
	// 		})
	// 	}
	//
	// 	const session = await this.sessionService.saveSession(request, account)
	//
	// 	return session
	// }
}
