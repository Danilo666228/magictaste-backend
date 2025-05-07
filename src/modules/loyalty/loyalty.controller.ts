import { Body, Controller, Get, Post, Query, HttpCode } from '@nestjs/common'
import { LoyaltyService } from './loyalty.service'

import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { AddPointsDto } from './dto/add-points.dto'
import { CreateLoyaltyLevelDto } from './dto/create-loyalty-level.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Программа лояльности')
@Controller('loyalty')
export class LoyaltyController {
	constructor(private readonly loyaltyService: LoyaltyService) {}

	@ApiOperation({ summary: 'Создать уровень лояльности' })
	@HttpCode(201)
	@Post('levels')
	@Authorization('ADMIN')
	public async createLoyaltyLevel(@Body() data: CreateLoyaltyLevelDto) {
		return await this.loyaltyService.createLoyaltyLevel(data)
	}

	@ApiOperation({ summary: 'Получить все уровни лояльности' })
	@HttpCode(200)
	@Get('levels')
	public async getLoyaltyLevels() {
		return await this.loyaltyService.getLoyaltyLevels()
	}

	@ApiOperation({ summary: 'Получить уровень лояльности пользователя' })
	@HttpCode(200)
	@Get('account')
	@Authorization()
	public async getAccountLoyalty(@Authorized('id') accountId: string) {
		return await this.loyaltyService.getAccountLoyalty(accountId)
	}

	@ApiOperation({ summary: 'Получить следующий уровень лояльности' })
	@HttpCode(200)
	@Get('next-level')
	@Authorization()
	public async getNextLevelLoyaltyAccount(@Authorized('id') accountId: string) {
		return await this.loyaltyService.getNextLevelLoyaltyAccount(accountId)
	}

	@ApiOperation({ summary: 'Получить транзакции уровня лояльности' })
	@HttpCode(200)
	@Get('transactions')
	@Authorization()
	public async getLoyaltyTransactions(
		@Authorized('id') accountId: string,
		@Query('page') page: string,
		@Query('limit') limit: string
	) {
		return await this.loyaltyService.getLoyaltyTransactions(accountId, Number(page), Number(limit))
	}

	@ApiOperation({ summary: 'Добавить поинты лояльности' })
	@HttpCode(201)
	@Post('points')
	@Authorization('ADMIN')
	public async addPoints(@Authorized('id') accountId: string, @Body() data: AddPointsDto) {
		return await this.loyaltyService.addPoints(accountId, data)
	}

	@ApiOperation({ summary: 'Иницилизировать уровень лояльности' })
	@HttpCode(201)
	@Post('initialize')
	@Authorization('ADMIN')
	public async initializeAccountLoyalty(@Authorized('id') accountId: string) {
		return await this.loyaltyService.initializeAccountLoyalty(accountId)
	}
}
