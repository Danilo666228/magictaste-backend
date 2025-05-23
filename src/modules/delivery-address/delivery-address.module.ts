import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { DeliveryAddressController } from './delivery-address.controller'
import { DeliveryAddressService } from './delivery-address.service'

@Module({
	controllers: [DeliveryAddressController],
	providers: [DeliveryAddressService, AccountService]
})
export class DeliveryAddressModule {}
