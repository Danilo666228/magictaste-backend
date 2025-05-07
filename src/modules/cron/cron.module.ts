import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { OrderService } from '../order/order.service'
import { CronService } from './cron.service'
import { LoyaltyService } from '../loyalty/loyalty.service'
@Module({
	providers: [CronService, OrderService, AccountService, LoyaltyService]
})
export class CronModule {}
