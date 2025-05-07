import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { AccountService } from './account.service'

import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Аккаунт')
@Controller('accounts')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@ApiOperation({ summary: 'Получить всех пользователей' })
	@ApiQuery({ name: 'page', type: Number, description: 'Номер страницы', example: 1, required: false })
	@ApiQuery({ name: 'limit', type: Number, description: 'Лимит', example: 10, required: false })
	@HttpCode(200)
	@Authorization('ADMIN', 'SUPER_ADMIN')
	@Get()
	public async getAccounts(@Query('page') page?: number, @Query('limit') limit?: number) {
		return await this.accountService.getAccounts(page, limit)
	}
}
