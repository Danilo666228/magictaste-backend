import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[Markup.button.callback('👤 Просмотреть профиль', 'me')],
		[Markup.button.url('🌐 На сайт', 'https://magictaste.ru')]
	]),
	auth: Markup.inlineKeyboard([
		[Markup.button.url('🌐 На сайт', 'https://kovinskiymagictaste.ru/dashboard/settings/notification')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.callback('👤 Мой профиль', 'profile'),
		Markup.button.url('🥟 Мои заказы', `https://kovinskiymagictaste.ru/dashboard/orders`)
	]),
	updateProfile: Markup.inlineKeyboard([
		[Markup.button.url('👤 Обновить профиль', 'https://kovinskiymagictaste.ru/dashboard/settings/profile')]
	])
}
