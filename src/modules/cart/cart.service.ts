import { CartEntity } from '@/core/entities/cart.entity'
import { PrismaService } from '@/core/prisma/prisma.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { NotificationsService } from '../notifications/notifications.service'
import { DecreaseCartDto } from './dto/cart.dto'

@Injectable()
export class CartService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

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
			await this.prismaService.cart.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity }
			})
		} else {
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
			return this.removeFromCart(accountId, dto.productId)
		}

		await this.prismaService.cart.update({
			where: { id: cartItem.id },
			data: { quantity: cartItem.quantity - dto.quantity }
		})

		return this.getCart(accountId)
	}

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

		return this.getCart(accountId)
	}

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

		return { message: 'Корзина успешно очищена' }
	}

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

		return this.getCart(accountId)
	}
}
