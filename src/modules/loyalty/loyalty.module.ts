import { Global, Module } from '@nestjs/common'
import { LoyaltyController } from './loyalty.controller'
import { LoyaltyService } from './loyalty.service'
import { AccountService } from '../auth/account/account.service'

@Global()
@Module({
	controllers: [LoyaltyController],
	providers: [LoyaltyService, AccountService],
	exports: [LoyaltyService]
})
export class LoyaltyModule {}
