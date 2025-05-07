import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { IngredientController } from './ingredient.controller'
import { IngredientService } from './ingredient.service'

@Module({
	controllers: [IngredientController],
	providers: [IngredientService, AccountService]
})
export class IngredientModule {}
