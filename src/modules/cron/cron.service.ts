import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from '../../core/prisma/prisma.service'
import { NotificationsService } from '../notifications/notifications.service'
import { OrderService } from '../order/order.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly orderService: OrderService,
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

	// @Cron(CronExpression.EVERY_5_MINUTES)
	// public async checkPendingPayments() {
	// 	await this.orderService.checkPendingPayments()
	// }

	// // Объединенная операция для обработки всех статусов заказов
	@Cron('0 */2 * * * *', { name: 'processAllOrders' })
	public async processAllOrders() {
		try {
			// 1. Обрабатываем заказы в статусе "Доставляется" -> "Выполнен" (15 минут)
			// Только для курьерской доставки
			const deliveringOrders = await this.prismaService.order.findMany({
				where: {
					status: 'DELIVERING',
					deliveryType: 'COURIER', // Только для курьерской доставки
					updatedAt: {
						lte: new Date(Date.now() - 15 * 60 * 1000) // 15 минут
					}
				}
			})

			for (const order of deliveringOrders) {
				console.log(`Перевод заказа ${order.id} из статуса DELIVERING в COMPLETED`)
				await this.notificationsService.create({
					accountId: order.accountId,
					title: 'Заказ выполнен',
					message: `Заказ ${order.id.slice(0, 5)} доставлен`,
					type: 'success',
					save: true
				})
				await this.prismaService.order.update({
					where: { id: order.id },
					data: {
						status: 'COMPLETED'
					}
				})
			}

			// 2. Обрабатываем заказы в статусе "Готов к доставке" -> "Доставляется" (2 минуты)
			// Только для курьерской доставки
			const readyOrders = await this.prismaService.order.findMany({
				where: {
					status: 'READY_FOR_DELIVERY',
					deliveryType: 'COURIER', // Только для курьерской доставки
					updatedAt: {
						lte: new Date(Date.now() - 2 * 60 * 1000) // 2 минуты
					}
				}
			})

			for (const order of readyOrders) {
				console.log(`Перевод заказа ${order.id} из статуса READY_FOR_DELIVERY в DELIVERING`)
				await this.notificationsService.create({
					accountId: order.accountId,
					title: 'Заказ передан курьеру',
					message: `Ваш заказ ${order.id.slice(0, 5)} передан курьеру. Ожидайте в течении 15 минут.`,
					type: 'success',
					save: true
				})
				await this.prismaService.order.update({
					where: { id: order.id },
					data: {
						status: 'DELIVERING'
					}
				})
			}

			// 3. Обрабатываем заказы в статусе "В обработке" -> "Готов к доставке" (5 минут)
			// Для всех типов доставки
			const processingOrders = await this.prismaService.order.findMany({
				where: {
					status: 'PROCESSING',
					updatedAt: {
						lte: new Date(Date.now() - 5 * 60 * 1000) // 5 минут
					}
				}
			})

			for (const order of processingOrders) {
				console.log(`Перевод заказа ${order.id} из статуса PROCESSING в READY_FOR_DELIVERY`)

				// Для самовывоза заказ остается в статусе "Готов к доставке" до тех пор,
				// пока клиент не заберет его (это должно управляться вручную)
				await this.notificationsService.create({
					accountId: order.accountId,
					title: 'Заказ готов',
					message: `Ваш заказ ${order.id.slice(0, 5)} готов к ${order.deliveryType === 'PICKUP' ? 'самовывозу' : 'доставке'}. ${
						order.deliveryType === 'PICKUP' ? 'Вы можете забрать его в нашем магазине.' : 'Передаём заказ курьеру.'
					}`,
					type: 'success',
					save: true
				})

				await this.prismaService.order.update({
					where: { id: order.id },
					data: {
						status: 'READY_FOR_DELIVERY'
					}
				})
			}

			// 4. Обрабатываем заказы в статусе "Оплачен" -> "В обработке" (2 минуты)
			// Для всех типов доставки
			const payedOrders = await this.prismaService.order.findMany({
				where: {
					status: 'PAYED',
					paymentStatus: 'COMPLETED',
					updatedAt: {
						lte: new Date(Date.now() - 2 * 60 * 1000) // 2 минуты
					}
				}
			})

			for (const order of payedOrders) {
				console.log(`Перевод заказа ${order.id} из статуса PAYED в PROCESSING`)
				await this.notificationsService.create({
					accountId: order.accountId,
					title: 'Заказ передан в обработку',
					message: `Ваш заказ ${order.id.slice(0, 5)} передан в обработку`,
					type: 'success',
					save: true
				})
				await this.prismaService.order.update({
					where: { id: order.id },
					data: {
						status: 'PROCESSING'
					}
				})
			}
		} catch (error) {
			console.error('Ошибка при обработке статусов заказов:', error)
		}
	}
}
