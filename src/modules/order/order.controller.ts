import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common'

import { AccountEntity } from '@/core/entities/account.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { OrderDto } from './dto/order.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'
import { OrderService } from './order.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

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

	@ApiOperation({ summary: 'Обновить статус платежа' })
	@HttpCode(200)
	@Post('status')
	public async updateStatus(@Body() dto: PaymentStatusDto) {
		return await this.orderService.updateStatus(dto)
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

	// @HttpCode(200)
	// @Post(':id/cancel')
	// @Authorization()
	// public async cancelOrder(@Param('id') id: string, @Authorized() account: AccountEntity) {
	// 	return await this.orderService.cancelOrder(id, account)
	// }

	// // Эндпоинты для администраторов

	// @HttpCode(200)
	// @Patch(':id')
	// @Authorization('ADMIN')
	// public async updateOrder(@Param('id') id: string, @Body() data: UpdateOrderDto) {
	// 	return await this.orderService.updateOrder(id, data)
	// }

	// @HttpCode(200)
	// @Post(':id/ready-for-delivery')
	// @Authorization('ADMIN')
	// public async markAsReadyForDelivery(@Param('id') id: string) {
	// 	return await this.orderService.markAsReadyForDelivery(id)
	// }

	// @HttpCode(200)
	// @Post(':id/delivering')
	// @Authorization('ADMIN')
	// public async markAsDelivering(@Param('id') id: string) {
	// 	return await this.orderService.markAsDelivering(id)
	// }

	// @HttpCode(200)
	// @Post(':id/complete')
	// @Authorization('ADMIN')
	// public async markAsCompleted(@Param('id') id: string) {
	// 	return await this.orderService.markAsCompleted(id)
	// }

	// @HttpCode(200)
	// @Post(':id/return')
	// @Authorization('ADMIN')
	// public async markAsReturned(@Param('id') id: string, @Body() dto: ReturnOrderDto) {
	// 	return await this.orderService.markAsReturned(id, dto.reason)
	// }

	// // Эндпоинт для ручного запуска проверки статусов платежей
	// @HttpCode(200)
	// @Post('check-payments')
	// @Authorization('ADMIN')
	// public async checkPendingPayments() {
	// 	return await this.orderService.checkPendingPayments()
	// }
}
