import { IsBoolean } from 'class-validator'

export class NotificationSettingsDto {
	@IsBoolean()
	public siteNotifications: boolean
	@IsBoolean()
	public telegramNotifications: boolean
}
