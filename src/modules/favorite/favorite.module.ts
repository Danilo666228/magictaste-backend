import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { FavoriteController } from './favorite.controller'
import { FavoriteService } from './favorite.service'

@Module({
	controllers: [FavoriteController],
	providers: [FavoriteService, AccountService]
})
export class FavoriteModule {}
