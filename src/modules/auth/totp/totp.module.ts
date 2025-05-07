import { Module } from '@nestjs/common'
import { TotpService } from './totp.service'
import { TotpController } from './totp.controller'
import { AccountService } from '../account/account.service'
import { LoyaltyService } from '@/modules/loyalty/loyalty.service'

@Module({
	controllers: [TotpController],
	providers: [TotpService, AccountService, LoyaltyService]
})
export class TotpModule {}
