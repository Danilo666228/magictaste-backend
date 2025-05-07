import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getMailerConfig = async (configService: ConfigService): Promise<MailerOptions> => {
	const host = configService.get<string>('MAIL_HOST')
	const port = configService.get<number>('MAIL_PORT')
	const user = configService.get<string>('MAIL_LOGIN')
	const pass = configService.get<string>('MAIL_PASSWORD')

	return {
		transport: {
			host,
			port,
			secure: false,
			auth: { user, pass }
		},
		defaults: {
			from: `"MagicTaste Team" <${user}>`
		}
	}
}
