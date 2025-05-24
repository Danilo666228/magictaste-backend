import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { OrderService } from '../order/order.service'
import { CronService } from './cron.service'
import { LoyaltyService } from '../loyalty/loyalty.service'
import { PaymentService } from '../libs/payment/payment.service'
@Module({
	providers: [CronService, OrderService, AccountService, LoyaltyService, PaymentService]
})
export class CronModule {}
