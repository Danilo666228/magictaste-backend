import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Controller, Delete, Get, HttpCode, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { SessionService } from './session.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Сессии')
@Controller('session')
export class SessionController {
	constructor(private readonly sessionService: SessionService) {}

	@ApiOperation({
		summary: 'Получить все сессии пользователя'
	})
	@HttpCode(200)
	@Authorization()
	@Get()
	public async getAllSessions(@Req() request: Request) {
		return await this.sessionService.findByUser(request)
	}

	@ApiOperation({
		summary: 'Получить текущую сессию пользователя'
	})
	@HttpCode(200)
	@Authorization()
	@Get('current')
	public async getCurrentSession(@Req() request: Request) {
		return this.sessionService.findCurrentSession(request)
	}

	@ApiOperation({
		summary: 'Удалить сессию'
	})
	@HttpCode(200)
	@Delete()
	public async removeSession(@Req() request: Request, @Query('id') id: string) {
		return await this.sessionService.remove(request, id)
	}

	@ApiOperation({
		summary: 'Очистить сессию'
	})
	@HttpCode(200)
	@Delete('/clear')
	public async clearSession(@Req() request: Request) {
		return await this.sessionService.clearSession(request)
	}
}
