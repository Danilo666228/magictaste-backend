import { Module } from '@nestjs/common'

import { AccountService } from '../auth/account/account.service'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'

@Module({
	controllers: [CartController],
	providers: [CartService, AccountService]
})
export class CartModule {}
