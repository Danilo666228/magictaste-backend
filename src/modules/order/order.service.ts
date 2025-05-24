import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LocaleEnum } from 'nestjs-yookassa'
import { DeliveryType, OrderStatus } from 'prisma/generated'
import { PrismaService } from '../../core/prisma/prisma.service'

import { AccountEntity } from '@/core/entities/account.entity'
import { OrderEntity } from '@/core/entities/order.entity'
import { ICreatePayment } from '@a2seven/yoo-checkout'
import { plainToInstance } from 'class-transformer'
import { AccountService } from '../auth/account/account.service'
import { PaymentService } from '../libs/payment/payment.service'
import { LoyaltyService } from '../loyalty/loyalty.service'
import { NotificationsService } from '../notifications/notifications.service'
import { OrderDto } from './dto/order.dto'

@Injectable()
export class OrderService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly accountService: AccountService,
		private readonly notificationsService: NotificationsService,
		private readonly loyaltyService: LoyaltyService,
		private readonly paymentService: PaymentService
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

		const productIds = dto.items.map(item => item.productId)
		const products = await this.prismaService.product.findMany({
			where: {
				id: {
					in: productIds
				}
			}
		})

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

		const order = await this.prismaService.order.create({
			data: {
				status: 'WAITING_FOR_PAYMENT',
				deliveryAddressId: dto.deliveryAddressId ? dto.deliveryAddressId : null,
				deliveryAddress: dto.deliveryAddress ? dto.deliveryAddress : null,
				deliveryType: dto.deliveryType || DeliveryType.COURIER,
				firstName: dto.firstName,
				phone: dto.phone,
				comment: dto.comment,
				paymentMethod: dto.paymentMethod,
				paymentStatus: 'PENDING',
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

		if (dto.paymentMethod === 'CASH') {
			await this.prismaService.order.update({
				where: { id: order.id },
				data: {
					status: 'PROCESSING'
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

		const paymentData: ICreatePayment = {
			amount: {
				value: dto.totalPrice.toString(),
				currency: 'RUB'
			},
			description: `Платеж в магазине Magic Taste. Id заказа: #${order.id}`,
			payment_method_data: {
				type: 'bank_card'
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

		const payment = await this.paymentService.createPayment(paymentData)

		return payment
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
		const payments = await this.paymentService.getPayments()
		return payments.items.find(item => item.metadata.orderId === orderId)
	}
}
