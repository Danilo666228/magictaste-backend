import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { YookassaModule } from 'nestjs-yookassa'

import { getYookassaConfig } from '@/core/config/yookassa.config'
import { AccountService } from '../auth/account/account.service'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { LoyaltyService } from '../loyalty/loyalty.service'

@Module({
	imports: [
		YookassaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getYookassaConfig,
			inject: [ConfigService]
		})
	],
	controllers: [OrderController],
	providers: [OrderService, AccountService, LoyaltyService]
})
export class OrderModule {}
