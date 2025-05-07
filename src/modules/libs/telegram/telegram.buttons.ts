import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[Markup.button.callback('👤 Просмотреть профиль', 'me')],
		[Markup.button.url('🌐 На сайт', 'https://magictaste.ru')]
	]),
	profile: Markup.inlineKeyboard([[Markup.button.url('⚙️ Настройки аккаунта', 'https://magictaste.ru/dashboard/settings')]])
}
