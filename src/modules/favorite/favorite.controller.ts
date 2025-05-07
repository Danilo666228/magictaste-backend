import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { FavoriteService } from './favorite.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Избранные товары')
@Controller('favorite')
export class FavoriteController {
	constructor(private readonly favoriteService: FavoriteService) {}
	@ApiOperation({ summary: 'Переключать добавление и удаление товара' })
	@HttpCode(200)
	@Post('toggle')
	@Authorization()
	public async toggleFavoriteProduct(@Query('productId') productId: string, @Authorized('id') userId?: string) {
		return await this.favoriteService.toggleFavorite(productId, userId)
	}

	@ApiOperation({ summary: 'Получить все избранные продукты' })
	@HttpCode(200)
	@Get('all')
	@Authorization()
	public async getFavoriteProducts(@Authorized('id') userId: string, @Query('search') search?: string) {
		return await this.favoriteService.getFavoriteProducts(userId, search)
	}
}
