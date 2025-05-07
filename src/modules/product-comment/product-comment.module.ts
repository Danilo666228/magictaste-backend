import { Module } from '@nestjs/common'

import { AccountService } from '../auth/account/account.service'
import { ProductCommentController } from './product-comment.controller'
import { ProductCommentService } from './product-comment.service'

import { LoyaltyService } from '../loyalty/loyalty.service'

@Module({
	controllers: [ProductCommentController],
	providers: [ProductCommentService, AccountService, LoyaltyService]
})
export class ProductCommentModule {}
