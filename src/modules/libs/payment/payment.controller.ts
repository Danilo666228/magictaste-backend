import { PaymentNotificationDto } from '@/modules/order/dto/payment-status.dto'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaymentService } from './payment.service'

@ApiTags('Оплата')
@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}
	@ApiOperation({ summary: 'Обновить статус платежа' })
	@HttpCode(200)
	@Post('notification')
	public async handleNotification(@Body() dto: PaymentNotificationDto) {
		return await this.paymentService.handleNotification(dto)
	}
}
