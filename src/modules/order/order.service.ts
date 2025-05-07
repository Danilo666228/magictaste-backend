import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
	CurrencyEnum,
	LocaleEnum,
	PaymentCreateRequest,
	PaymentDetails,
	PaymentMethodsEnum,
	YookassaService
} from 'nestjs-yookassa'
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from 'prisma/generated'
import { PrismaService } from '../../core/prisma/prisma.service'

import { AccountEntity } from '@/core/entities/account.entity'
import { OrderEntity } from '@/core/entities/order.entity'
import { ms } from '@/shared/common/ms'
import { plainToInstance } from 'class-transformer'
import { AccountService } from '../auth/account/account.service'
import { LoyaltyService } from '../loyalty/loyalty.service'
import { NotificationsService } from '../notifications/notifications.service'
import { OrderDto } from './dto/order.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'

@Injectable()
export class OrderService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly yookassaService: YookassaService,
		private readonly configService: ConfigService,
		private readonly accountService: AccountService,
		private readonly notificationsService: NotificationsService,
		private readonly loyaltyService: LoyaltyService
	) {}

	public async createPayment(dto: OrderDto, account: AccountEntity) {
		const loyalty = await this.loyaltyService.getAccountLoyalty(account.id)
		const existOrder = await this.prismaService.order.findFirst({
			where: {
				accountId: account.id,
				status: OrderStatus.WAITING_FOR_PAYMENT
			}
		})
		if (existOrder) {
			await this.notificationsService.create({
				accountId: account.id,
				title: 'Оформление заказа',
				message: 'У вас уже есть неоплаченный заказ.',
				type: 'error'
			})
			throw new BadRequestException('У вас уже есть неоплаченный заказ.')
		}

		if (!dto.deliveryAddressId && !dto.deliveryAddress) {
			this.notificationsService.create({
				accountId: account.id,
				title: 'Оформление заказа',
				message: 'Укажите адрес доставки',
				type: 'error'
			})
			throw new BadRequestException('Укажите адрес доставки')
		}

		// Получаем полную информацию о продуктах для сохранения в OrderItem
		const productIds = dto.items.map(item => item.productId)
		const products = await this.prismaService.product.findMany({
			where: {
				id: {
					in: productIds
				}
			}
		})

		if (loyalty && dto.useLoyaltyPoints && loyalty.points > 0) {
			const maxDiscount = Math.floor(dto.totalPrice * 0.2)

			const pointsToUse = Math.min(loyalty.points, maxDiscount)

			if (pointsToUse > 0) {
				dto.totalPrice -= pointsToUse
			}
		}

		const orderItems = dto.items.map(item => {
			const product = products.find(p => p.id === item.productId)
			return {
				quantity: item.quantity,
				price: item.price,
				productTitle: product.title,
				productDescription: product.description,
				productImageUrl: product.imageUrl,
				product: {
					connect: {
						id: item.productId
					}
				}
			}
		})

		const paymentMethod = this.mapPaymentMethod(dto.paymentMethod)

		const order = await this.prismaService.order.create({
			data: {
				status: dto.status || OrderStatus.WAITING_FOR_PAYMENT,
				deliveryAddressId: dto.deliveryAddressId ? dto.deliveryAddressId : null,
				deliveryAddress: dto.deliveryAddress ? dto.deliveryAddress : null,
				deliveryType: dto.deliveryType || DeliveryType.COURIER,
				firstName: dto.firstName,
				phone: dto.phone,
				comment: dto.comment,
				paymentMethod: paymentMethod,
				paymentStatus: PaymentStatus.PENDING,
				lastName: dto.lastName,
				email: dto.email,
				items: {
					create: orderItems
				},
				total: dto.totalPrice,
				account: {
					connect: {
						id: account.id
					}
				}
			},
			include: {
				items: true
			}
		})

		// Если пользователь решил использовать баллы, списываем их после создания заказа
		// if (loyalty && dto.useLoyaltyPoints && loyalty.points > 0) {
		// 	const maxDiscount = Math.floor(dto.totalPrice * 0.2)
		// 	const pointsToUse = Math.min(loyalty.points, maxDiscount)

		// 	if (pointsToUse > 0) {
		// 		await this.loyaltyService.addPoints(account.id, {
		// 			points: -pointsToUse,
		// 			type: 'PURCHASE',
		// 			orderId: order.id,
		// 			description: `Списание баллов за заказ #${order.id}`,
		// 			metadata: {
		// 				orderTotal: dto.totalPrice,
		// 				discount: pointsToUse
		// 			}
		// 		})
		// 	}
		// }

		if (paymentMethod === PaymentMethod.CASH) {
			await this.prismaService.order.update({
				where: { id: order.id },
				data: {
					status: OrderStatus.PROCESSING
				}
			})

			return {
				id: order.id,
				status: OrderStatus.PROCESSING,
				confirmation: {
					confirmation_url: null
				},
				paid: false,
				payment_method: {
					type: 'cash'
				}
			}
		}

		const yookassaPaymentMethod = this.getYookassaPaymentMethod(paymentMethod)

		const paymentData: PaymentCreateRequest = {
			amount: {
				value: dto.totalPrice,
				currency: CurrencyEnum.RUB
			},
			description: 'Платеж в магазине Magic Taste. Id заказа: #' + order.id,
			payment_method_data: {
				type: yookassaPaymentMethod as any
			},
			confirmation: {
				type: 'redirect',
				return_url: process.env.YOOKASSA_REDIRECT_URL,
				locale: LocaleEnum.ru_RU
			},
			metadata: {
				orderId: order.id,
				accountId: account.id
			}
		}

		const newPayment = await this.yookassaService.createPayment(paymentData)

		// Устанавливаем таймер для автоматической отмены заказа, если он не оплачен
		// setTimeout(async () => {
		// 	const updatedOrder = await this.prismaService.order.findUnique({
		// 		where: { id: order.id }
		// 	})

		// 	if (updatedOrder.status === 'WAITING_FOR_PAYMENT') {
		// 		// Проверяем статус платежа в Yookassa перед отменой
		// 		try {
		// 			const paymentInfo = await this.getPaymentById(order.id)
		// 			if (paymentInfo && paymentInfo.status === 'waiting_for_payment') {
		// 				// Пытаемся отменить платеж в Yookassa, передаем только ID
		// 				await this.yookassaService.cancelPayment(paymentInfo.id)
		// 			}
		// 		} catch (error) {
		// 			console.error('Ошибка при проверке/отмене платежа в Yookassa:', error)
		// 		}

		// 		// Отменяем заказ в нашей системе
		// 		await this.prismaService.order.update({
		// 			where: { id: order.id },
		// 			data: {
		// 				status: 'CANCELED',
		// 				paymentStatus: 'FAILED'
		// 			}
		// 		})

		// 		await this.notificationsService.create({
		// 			accountId: account.id,
		// 			title: 'Оформление заказа',
		// 			message: `Ваш заказа отменён из-за превышенного времени ожидания`
		// 		})
		// 	}
		// }, ms('10m'))

		return newPayment
	}

	// Преобразование метода оплаты из DTO в PaymentMethod из схемы
	private mapPaymentMethod(method: string): PaymentMethod {
		switch (method) {
			case 'CARD':
				return PaymentMethod.CARD
			case 'CASH':
				return PaymentMethod.CASH
			case 'ONLINE_WALLET':
				return PaymentMethod.ONLINE_WALLET
			case 'BANK_TRANSFER':
				return PaymentMethod.BANK_TRANSFER
			default:
				return PaymentMethod.CARD
		}
	}

	// Получение типа платежного метода для Yookassa
	private getYookassaPaymentMethod(method: PaymentMethod): PaymentMethodsEnum {
		switch (method) {
			case PaymentMethod.CARD:
				return PaymentMethodsEnum.bank_card
			case PaymentMethod.ONLINE_WALLET:
				return PaymentMethodsEnum.yoo_money
			case PaymentMethod.BANK_TRANSFER:
				return PaymentMethodsEnum.sberbank
			default:
				return PaymentMethodsEnum.bank_card
		}
	}

	public async getOrders(account: AccountEntity, page: number = 1, limit: number = 10) {
		const orders = await this.prismaService.order.findMany({
			where: {
				accountId: account.id
			},
			orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
			include: {
				items: true
			},
			...(page && limit
				? {
						skip: (page - 1) * limit,
						take: limit
					}
				: {})
		})

		return plainToInstance(OrderEntity, orders)
	}

	public async getOrderById(orderId: string, account: AccountEntity) {
		const order = await this.prismaService.order.findFirst({
			where: {
				id: orderId,
				accountId: account.id
			},
			include: {
				items: true
			}
		})

		if (!order) {
			console.log('Заказ не найден')
			throw new BadRequestException('Заказ не найден')
		}

		return plainToInstance(OrderEntity, order)
	}

	public async getPaymentById(orderId: string) {
		try {
			const payments: any = await this.yookassaService.getPayments()
			return payments.items.find((item: PaymentDetails) => item.description.split('#')[1] === orderId)
		} catch (error) {
			console.error('Ошибка при получении информации о платеже:', error)
			return null
		}
	}

	public async updateStatus(dto: PaymentStatusDto) {
		// Проверяем, есть ли описание и можно ли извлечь orderId
		if (!dto.object.description || !dto.object.description.includes('#')) {
			console.error('Невозможно извлечь orderId из описания платежа:', dto.object.description)
			// Пробуем получить orderId из metadata
			if (dto.object.metadata && dto.object.metadata.orderId) {
				const orderId = dto.object.metadata.orderId
				return await this.handlePaymentStatus(dto.event, orderId, dto.object.id)
			}
			return
		}

		const orderId = dto.object.description.split('#')[1]
		return this.handlePaymentStatus(dto.event, orderId, dto.object.id)
	}

	private async handlePaymentStatus(event: string, orderId: string, paymentId: string) {
		const orderExists = await this.prismaService.order.findUnique({
			where: { id: orderId }
		})

		if (!orderExists) {
			console.error(`Заказ с ID ${orderId} не найден при обработке события ${event}`)
			return
		}

		if (event === 'payment.waiting_for_capture') {
			await this.yookassaService.capturePayment(paymentId)
		} else if (event === 'payment.succeeded') {
			await this.loyaltyService.addPoints(orderExists.accountId, {
				points: Math.floor(orderExists.total * 0.05), // 5% от суммы заказа
				type: 'PURCHASE',
				orderId: orderId,
				description: `Бонусные баллы за оплату заказа #${orderId}`,
				metadata: {
					orderTotal: orderExists.total
				}
			})

			await this.notificationsService.create({
				accountId: orderExists.accountId,
				title: 'Платеж успешно прошел',
				message: 'Платеж успешно прошел',
				type: 'success',
				save: true
			})

			return await this.prismaService.order.update({
				where: { id: orderId },
				data: {
					status: 'PAYED',
					paymentStatus: 'COMPLETED'
				}
			})
		} else if (event === 'payment.canceled') {
			await this.notificationsService.create({
				accountId: orderExists.accountId,
				title: 'Платеж отменен',
				message: 'Платеж отменен',
				type: 'error',
				save: true
			})
			return await this.prismaService.order.update({
				where: { id: orderId },
				data: {
					status: 'CANCELED',
					paymentStatus: 'FAILED'
				}
			})
		} else if (event === 'payment.failed') {
			// Добавляем обработку случая, когда платеж не прошел (недостаточно средств и т.д.)
			return await this.prismaService.order.update({
				where: { id: orderId },
				data: {
					status: 'WAITING_FOR_PAYMENT',
					paymentStatus: 'FAILED'
				}
			})
		}
	}

	// public async updateOrder(orderId: string, data: any) {
	// 	const order = await this.prismaService.order.findUnique({
	// 		where: { id: orderId }
	// 	})

	// 	if (!order) {
	// 		throw new BadRequestException('Заказ не найден')
	// 	}

	// 	// Проверка на допустимые переходы статусов
	// 	if (data.status && !this.isValidStatusTransition(order.status, data.status)) {
	// 		throw new BadRequestException(`Недопустимый переход статуса с ${order.status} на ${data.status}`)
	// 	}

	// 	return await this.prismaService.order.update({
	// 		where: { id: orderId },
	// 		data
	// 	})
	// }

	// // Проверка допустимости перехода между статусами
	// private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
	// 	// Определяем допустимые переходы статусов
	// 	const validTransitions = {
	// 		[OrderStatus.WAITING_FOR_PAYMENT]: [OrderStatus.PAYED, OrderStatus.CANCELED],
	// 		[OrderStatus.PAYED]: [OrderStatus.PROCESSING, OrderStatus.CANCELED, OrderStatus.RETURNED],
	// 		[OrderStatus.PROCESSING]: [OrderStatus.READY_FOR_DELIVERY, OrderStatus.CANCELED, OrderStatus.RETURNED],
	// 		[OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.DELIVERING, OrderStatus.CANCELED, OrderStatus.RETURNED],
	// 		[OrderStatus.DELIVERING]: [OrderStatus.COMPLETED, OrderStatus.RETURNED],
	// 		[OrderStatus.COMPLETED]: [OrderStatus.RETURNED],
	// 		[OrderStatus.CANCELED]: [],
	// 		[OrderStatus.RETURNED]: []
	// 	}

	// 	// Проверяем, является ли переход допустимым
	// 	return validTransitions[currentStatus]?.includes(newStatus) || false
	// }

	// // Метод для отмены заказа пользователем
	// async cancelOrder(orderId: string, account: AccountEntity) {
	// 	const order = await this.prismaService.order.findFirst({
	// 		where: {
	// 			id: orderId,
	// 			accountId: account.id
	// 		}
	// 	})

	// 	if (!order) {
	// 		throw new BadRequestException('Заказ не найден')
	// 	}

	// 	// Пользователь может отменить заказ только в определенных статусах
	// 	const cancelableStatuses = ['WAITING_FOR_PAYMENT', 'PAYED', 'PROCESSING']

	// 	if (!cancelableStatuses.includes(order.status as any)) {
	// 		throw new BadRequestException(`Нельзя отменить заказ в статусе ${order.status}`)
	// 	}

	// 	// Если заказ уже оплачен, нужно инициировать возврат в Yookassa
	// 	if (order.status === 'PAYED' && order.paymentMethod !== 'CASH') {
	// 		try {
	// 			const paymentInfo = await this.getPaymentById(order.id)
	// 			if (paymentInfo && paymentInfo.status === 'succeeded') {
	// 				// Здесь должна быть логика для возврата средств через Yookassa
	// 				console.log('Необходимо инициировать возврат средств для платежа', paymentInfo.id)
	// 			}
	// 		} catch (error) {
	// 			console.error('Ошибка при проверке платежа для возврата:', error)
	// 		}
	// 	}

	// 	return await this.prismaService.order.update({
	// 		where: { id: orderId },
	// 		data: {
	// 			status: 'CANCELED',
	// 			paymentStatus: order.status === 'PAYED' ? 'REFUNDED' : 'FAILED'
	// 		}
	// 	})
	// }

	// async checkPendingPayments() {
	// 	try {
	// 		const pendingOrders = await this.prismaService.order.findMany({
	// 			where: {
	// 				status: 'WAITING_FOR_PAYMENT',
	// 				paymentStatus: 'PENDING',
	// 				paymentMethod: {
	// 					not: 'CASH'
	// 				},
	// 				// Проверяем только заказы, созданные не более 24 часов назад
	// 				createdAt: {
	// 					gte: new Date(Date.now() - ms('24h'))
	// 				}
	// 			}
	// 		})

	// 		for (const order of pendingOrders) {
	// 			const paymentInfo = await this.getPaymentById(order.id)

	// 			if (paymentInfo) {
	// 				// console.log(`Проверка заказа ${order.id}, статус платежа: ${paymentInfo.status}`)

	// 				if (paymentInfo.status === 'succeeded' || paymentInfo.status === 'waiting_for_capture') {
	// 					await this.prismaService.order.update({
	// 						where: { id: order.id },
	// 						data: {
	// 							status: 'PAYED',
	// 							paymentStatus: 'COMPLETED'
	// 						}
	// 					})
	// 				} else if (paymentInfo.status === 'canceled') {
	// 					await this.prismaService.order.update({
	// 						where: { id: order.id },
	// 						data: {
	// 							status: 'CANCELED',
	// 							paymentStatus: 'FAILED'
	// 						}
	// 					})
	// 				} else if (paymentInfo.status === 'pending') {
	// 					// Проверяем, не истекло ли время ожидания платежа
	// 					const paymentCreatedAt = new Date(paymentInfo.created_at)
	// 					const now = new Date()
	// 					const timeDiffMinutes = (now.getTime() - paymentCreatedAt.getTime()) / (1000 * 60)

	// 					// Если прошло больше 10 минут, считаем платеж просроченным
	// 					if (timeDiffMinutes > 10) {
	// 						console.log(`Платеж ${paymentInfo.id} для заказа ${order.id} просрочен (${timeDiffMinutes.toFixed(2)} минут)`)

	// 						try {
	// 							// Пытаемся отменить платеж в Yookassa
	// 							await this.yookassaService.cancelPayment(paymentInfo.id)

	// 							// Обновляем статус в нашей БД
	// 							await this.prismaService.order.update({
	// 								where: { id: order.id },
	// 								data: {
	// 									status: 'CANCELED',
	// 									paymentStatus: 'FAILED'
	// 								}
	// 							})
	// 						} catch (cancelError) {
	// 							// console.error(`Ошибка при отмене платежа ${paymentInfo.id}:`, cancelError)

	// 							// Даже если отмена не удалась, обновляем статус в нашей БД
	// 							// Это позволит избежать повторных попыток отмены
	// 							await this.prismaService.order.update({
	// 								where: { id: order.id },
	// 								data: {
	// 									status: 'CANCELED',
	// 									paymentStatus: 'FAILED'
	// 								}
	// 							})
	// 						}
	// 					}
	// 				}
	// 			} else {
	// 				// console.log(`Не найдена информация о платеже для заказа ${order.id}`)

	// 				// Если информация о платеже не найдена, но заказ в ожидании оплаты более 10 минут,
	// 				// отменяем его
	// 				const orderCreatedAt = new Date(order.createdAt)
	// 				const now = new Date()
	// 				const timeDiffMinutes = (now.getTime() - orderCreatedAt.getTime()) / (1000 * 60)

	// 				if (timeDiffMinutes > 1) {
	// 					await this.prismaService.order.update({
	// 						where: { id: order.id },
	// 						data: {
	// 							status: 'CANCELED',
	// 							paymentStatus: 'FAILED'
	// 						}
	// 					})
	// 				}
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.error('Ошибка при проверке статусов платежей:', error)
	// 	}
	// }

	// // Метод для перевода заказа в статус "Готов к доставке"
	// async markAsReadyForDelivery(orderId: string) {
	// 	const order = await this.prismaService.order.findUnique({
	// 		where: { id: orderId }
	// 	})

	// 	if (!order) {
	// 		throw new BadRequestException('Заказ не найден')
	// 	}

	// 	if (order.status !== 'PROCESSING') {
	// 		throw new BadRequestException('Заказ должен быть в статусе "В обработке"')
	// 	}

	// 	return await this.prismaService.order.update({
	// 		where: { id: orderId },
	// 		data: { status: 'READY_FOR_DELIVERY' }
	// 	})
	// }

	// // Метод для перевода заказа в статус "Доставляется"
	// async markAsDelivering(orderId: string) {
	// 	const order = await this.prismaService.order.findUnique({
	// 		where: { id: orderId }
	// 	})

	// 	if (!order) {
	// 		throw new BadRequestException('Заказ не найден')
	// 	}

	// 	if (order.status !== 'READY_FOR_DELIVERY') {
	// 		throw new BadRequestException('Заказ должен быть в статусе "Готов к доставке"')
	// 	}

	// 	return await this.prismaService.order.update({
	// 		where: { id: orderId },
	// 		data: { status: 'DELIVERING' }
	// 	})
	// }

	// // Метод для перевода заказа в статус "Выполнен"
	// async markAsCompleted(orderId: string) {
	// 	const order = await this.prismaService.order.findUnique({
	// 		where: { id: orderId }
	// 	})

	// 	if (!order) {
	// 		throw new BadRequestException('Заказ не найден')
	// 	}

	// 	if (order.status !== 'DELIVERING') {
	// 		throw new BadRequestException('Заказ должен быть в статусе "Доставляется"')
	// 	}

	// 	return await this.prismaService.order.update({
	// 		where: { id: orderId },
	// 		data: { status: 'COMPLETED' }
	// 	})
	// }

	// // Метод для перевода заказа в статус "Возвращен"
	// async markAsReturned(orderId: string, reason: string) {
	// 	const order = await this.prismaService.order.findUnique({
	// 		where: { id: orderId }
	// 	})

	// 	if (!order) {
	// 		throw new BadRequestException('Заказ не найден')
	// 	}

	// 	// Заказ можно вернуть из нескольких статусов
	// 	const validStatuses = ['PAYED', 'PROCESSING', 'READY_FOR_DELIVERY', 'DELIVERING', 'COMPLETED']

	// 	if (!validStatuses.includes(order.status as any)) {
	// 		throw new BadRequestException(`Нельзя вернуть заказ из статуса ${order.status}`)
	// 	}

	// 	// Если заказ был оплачен не наличными, инициируем возврат
	// 	if (order.paymentStatus === 'COMPLETED' && order.paymentMethod !== 'CASH') {
	// 		try {
	// 			const paymentInfo = await this.getPaymentById(order.id)
	// 			if (paymentInfo && paymentInfo.status === 'succeeded') {
	// 				// Здесь должна быть логика для возврата средств через Yookassa
	// 				console.log('Необходимо инициировать возврат средств для платежа', paymentInfo.id)
	// 				await this.yookassaService.createRefund({
	// 					payment_id: paymentInfo.id,
	// 					description: `Возврат заказа #${order.id}`
	// 				})
	// 			}
	// 		} catch (error) {
	// 			console.error('Ошибка при проверке платежа для возврата:', error)
	// 		}
	// 	}

	// 	return await this.prismaService.order.update({
	// 		where: { id: orderId },
	// 		data: {
	// 			status: 'RETURNED',
	// 			paymentStatus: order.paymentStatus === 'COMPLETED' ? 'REFUNDED' : order.paymentStatus,
	// 			comment: order.comment ? `${order.comment}\nПричина возврата: ${reason}` : `Причина возврата: ${reason}`
	// 		}
	// 	})
	// }
}
