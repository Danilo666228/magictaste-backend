import { CartEntity } from '@/core/entities/cart.entity'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../core/prisma/prisma.service'
import { NotificationsService } from '../notifications/notifications.service'
import { DecreaseCartDto } from './dto/cart.dto'

@Injectable()
export class CartService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}
	/**
	 * Получить корзину пользователя
	 */
	public async getCart(accountId: string) {
		const cart = await this.prismaService.cart.findMany({
			where: { accountId },
			include: {
				product: {
					include: {
						ingredients: {
							include: {
								ingredient: true
							}
						}
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		})

		if (!cart.length) {
			return { items: [], totalItems: 0, totalQuantity: 0 }
		}

		const cartItems = plainToInstance(CartEntity, cart)
		const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

		return {
			items: cartItems,
			totalItems: cart.length,
			totalQuantity
		}
	}

	/**
	 * Добавить продукт в корзину или увеличить его количество
	 */
	public async addToCart(accountId: string, productId: string, quantity: number = 1) {
		if (quantity < 1) {
			throw new BadRequestException('Количество должно быть больше 0')
		}

		const product = await this.prismaService.product.findUnique({
			where: { id: productId }
		})

		if (!product) {
			throw new NotFoundException('Продукт не найден')
		}

		const existingItem = await this.prismaService.cart.findFirst({
			where: { accountId, productId }
		})

		if (existingItem) {
			// Обновляем существующий товар
			await this.prismaService.cart.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity }
			})

			await this.notificationsService.create({
				accountId,
				title: 'Корзина',
				message: `Количество товара увеличено на ${quantity}`,
				type: 'success'
			})
		} else {
			// Добавляем новый товар
			await this.prismaService.cart.create({
				data: {
					accountId,
					productId,
					quantity
				}
			})

			await this.notificationsService.create({
				accountId,
				title: 'Корзина',
				message: 'Товар добавлен в корзину',
				type: 'success'
			})
		}

		return this.getCart(accountId)
	}

	/**
	 * Уменьшить количество продукта в корзине
	 */
	public async decreaseQuantity(accountId: string, dto: DecreaseCartDto) {
		const product = await this.prismaService.product.findUnique({
			where: { id: dto.productId }
		})

		if (!product) {
			throw new NotFoundException('Продукт не найден')
		}

		if (dto.quantity < 1) {
			throw new BadRequestException('Количество должно быть больше 0')
		}

		const cartItem = await this.prismaService.cart.findFirst({
			where: { accountId, productId: dto.productId }
		})

		if (!cartItem) {
			throw new NotFoundException('Товар не найден в корзине')
		}

		if (cartItem.quantity <= dto.quantity) {
			// Если количество меньше или равно запрошенному уменьшению - удаляем товар
			return this.removeFromCart(accountId, dto.productId)
		}

		// Уменьшаем количество
		await this.prismaService.cart.update({
			where: { id: cartItem.id },
			data: { quantity: cartItem.quantity - dto.quantity }
		})

		await this.notificationsService.create({
			accountId,
			title: 'Корзина',
			message: `Количество товара уменьшено на ${dto.quantity}`,
			type: 'success'
		})

		return this.getCart(accountId)
	}

	/**
	 * Удалить продукт из корзины
	 */
	public async removeFromCart(accountId: string, productId: string) {
		const cartItem = await this.prismaService.cart.findFirst({
			where: { accountId, productId }
		})

		if (!cartItem) {
			throw new NotFoundException('Товар не найден в корзине')
		}

		await this.prismaService.cart.delete({
			where: { id: cartItem.id }
		})

		await this.notificationsService.create({
			accountId,
			title: 'Корзина',
			message: 'Товар удален из корзины',
			type: 'success'
		})

		return this.getCart(accountId)
	}

	/**
	 * Очистить корзину
	 */
	public async clearCart(accountId: string) {
		const cart = await this.prismaService.cart.findMany({
			where: { accountId }
		})

		if (!cart.length) {
			throw new BadRequestException('Корзина уже пуста')
		}

		await this.prismaService.cart.deleteMany({
			where: { accountId }
		})

		await this.notificationsService.create({
			accountId,
			title: 'Корзина',
			message: 'Корзина очищена',
			type: 'success'
		})

		return { message: 'Корзина успешно очищена' }
	}

	/**
	 * Обновить количество продукта в корзине
	 */
	public async updateQuantity(accountId: string, productId: string, quantity: number) {
		if (quantity < 1) {
			return this.removeFromCart(accountId, productId)
		}

		const cartItem = await this.prismaService.cart.findFirst({
			where: { accountId, productId }
		})

		if (!cartItem) {
			throw new NotFoundException('Товар не найден в корзине')
		}

		await this.prismaService.cart.update({
			where: { id: cartItem.id },
			data: { quantity }
		})

		await this.notificationsService.create({
			accountId,
			title: 'Корзина',
			message: 'Количество товара обновлено',
			type: 'success'
		})

		return this.getCart(accountId)
	}
}
