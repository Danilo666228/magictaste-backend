import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaClient } from '../../../prisma/generated'

const prisma = new PrismaClient()

async function main() {
	try {
		Logger.log('Начало заполнения базы данных')
		await prisma.role.createMany({
			data: [
				{
					name: 'ADMIN'
				},
				{
					name: 'REGULAR'
				},
				{
					name: 'MANAGER'
				},
				{
					name: 'SUPER_ADMIN'
				},
				{
					name: 'SUPPORT'
				}
			]
		})
		const category = await prisma.category.createMany({
			data: [
				{
					title: 'Салаты'
				},
				{
					title: 'Супы'
				},
				{
					title: 'Пицца'
				},
				{
					title: 'Бургеры'
				},
				{
					title: 'Сэндвичи'
				},
				{
					title: 'Кава'
				},
				{
					title: 'Десерты'
				},
				{
					title: 'Закуски'
				},
				{
					title: 'Напитки'
				},
				{
					title: 'Снэки'
				}
			]
		})

		const ingredient = await prisma.ingredient.createMany({
			data: [
				{
					title: 'Картофель'
				},
				{
					title: 'Помидоры'
				},
				{
					title: 'Огурцы'
				},
				{
					title: 'Капуста'
				},
				{
					title: 'Морковь'
				},
				{
					title: 'Лук'
				},
				{
					title: 'Чеснок'
				},
				{
					title: 'Петрушка'
				},
				{
					title: 'Сыр'
				},
				{
					title: 'Колбаса'
				}
			]
		})

		Logger.log('Завершение заполнения базы данных')
	} catch (error) {
		Logger.log(error)
		throw new BadRequestException('Ошибка при заполнении базы данных')
	} finally {
		Logger.log('Закрытие соединение')
		await prisma.$disconnect()
	}
}

main()
