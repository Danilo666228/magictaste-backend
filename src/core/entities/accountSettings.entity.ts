import { Exclude } from 'class-transformer'
import { AccountSettings } from 'prisma/generated'

export class AccountSettingsEntity implements AccountSettings {
	id: string
	accountId: string
	isTwoFactorEmailEnabled: boolean
	isTwoFactorTotpEnabled: boolean
	totpSecret: string
	telegramId: string
	isVerifiedEmail: boolean
	siteNotification: boolean
	telegramNotification: boolean
}
