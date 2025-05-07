import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CartService } from './cart.service'
import { DecreaseCartDto } from './dto/cart.dto'

@ApiTags('Корзина')
@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@ApiOperation({ summary: 'Получить корзину пользователя' })
	@Get()
	@HttpCode(200)
	@Authorization()
	public async getCart(@Authorized('id') userId: string) {
		return this.cartService.getCart(userId)
	}

	@ApiOperation({ summary: 'Добавить товар в корзину' })
	@Post('add')
	@HttpCode(200)
	@Authorization()
	public async addToCart(
		@Body('productId') productId: string,
		@Body('quantity') quantity: number = 1,
		@Authorized('id') userId: string
	) {
		return this.cartService.addToCart(userId, productId, quantity)
	}

	@ApiOperation({ summary: 'Уменьшить количество товара' })
	@Post('decrease')
	@HttpCode(200)
	@Authorization()
	public async decreaseQuantity(@Body() dto: DecreaseCartDto, @Authorized('id') userId: string) {
		return this.cartService.decreaseQuantity(userId, dto)
	}

	@ApiOperation({ summary: 'Обновить количество товара' })
	@Patch('quantity')
	@HttpCode(200)
	@Authorization()
	async updateQuantity(
		@Body('productId') productId: string,
		@Body('quantity') quantity: number,
		@Authorized('id') userId: string
	) {
		return this.cartService.updateQuantity(userId, productId, quantity)
	}

	@ApiOperation({ summary: 'Удалить товар из корзины' })
	@Delete('item')
	@HttpCode(200)
	@Authorization()
	async removeFromCart(@Query('productId') productId: string, @Authorized('id') userId: string) {
		return this.cartService.removeFromCart(userId, productId)
	}

	@ApiOperation({ summary: 'Очистить корзину' })
	@Delete('clear')
	@HttpCode(200)
	@Authorization()
	async clearCart(@Authorized('id') userId: string) {
		return this.cartService.clearCart(userId)
	}
}
