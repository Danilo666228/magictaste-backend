import { Module } from '@nestjs/common'

import { AccountService } from '../auth/account/account.service'
import { PaymentService } from '../libs/payment/payment.service'
import { LoyaltyService } from '../loyalty/loyalty.service'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
	controllers: [OrderController],
	providers: [OrderService, AccountService, LoyaltyService, PaymentService]
})
export class OrderModule {}
