import { Module } from '@nestjs/common'

import { AccountService } from '../auth/account/account.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, AccountService]
})
export class ProductModule {}
