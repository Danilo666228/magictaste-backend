import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common'

import { AccountEntity } from '@/core/entities/account.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { OrderDto } from './dto/order.dto'
import { OrderService } from './order.service'

@ApiTags('Заказы')
@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@ApiOperation({ summary: 'Создать платёж' })
	@HttpCode(200)
	@Post('place')
	@Authorization()
	public async createPayment(@Body() dto: OrderDto, @Authorized() account: AccountEntity) {
		return this.orderService.createPayment(dto, account)
	}

	@ApiOperation({ summary: 'Получить все заказы' })
	@HttpCode(200)
	@Get()
	@Authorization()
	public async getOrders(@Authorized() account: AccountEntity) {
		return await this.orderService.getOrders(account)
	}

	@ApiOperation({ summary: 'Получить ссылку на платеж' })
	@HttpCode(200)
	@Get('payment-link')
	@Authorization()
	public async getPaymentLink(@Query('orderId') orderId: string) {
		return await this.orderService.getPaymentById(orderId)
	}

	@ApiOperation({ summary: 'Получить заказ по Id' })
	@HttpCode(200)
	@Get(':id')
	@Authorization()
	public async getOrderById(@Param('id') id: string, @Authorized() account: AccountEntity) {
		return await this.orderService.getOrderById(id, account)
	}
}
