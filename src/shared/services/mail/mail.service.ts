import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { ResetPasswordTemplate } from './template/resetPassword'
import { TwoFactorTemplate } from './template/twoFactor'
import { VerifyTemplate } from './template/verifyEmail'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({ to: email, subject, html })
	}

	public async sendVerifyEmail(email: string, token: string, metadata: SessionMetadata) {
		const domain = this.configService.getOrThrow<string>('CLIENT_URL')

		const html = await render(VerifyTemplate({ domain, token, metadata }))

		return this.sendMail(email, 'Подтверждение почты', html)
	}

	public async sendResetPasswordEmail(email: string, token: string, metadata: SessionMetadata) {
		const domain = this.configService.getOrThrow<string>('CLIENT_URL')
		const html = await render(ResetPasswordTemplate({ domain, token, metadata }))

		return this.sendMail(email, 'Сброс пароля', html)
	}

	public async sendTwoFactorEmail(email: string, token: string, metadata: SessionMetadata) {
		const html = await render(TwoFactorTemplate({ token, metadata }))

		return this.sendMail(email, 'Двухфакторная аутентификация', html)
	}
}
