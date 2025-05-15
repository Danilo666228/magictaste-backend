import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { AccountService } from '@/modules/auth/account/account.service'

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, AccountService]
})
export class CategoryModule {}
