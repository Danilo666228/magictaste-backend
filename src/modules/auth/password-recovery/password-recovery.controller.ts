import { UserAgent } from '@/shared/decorators/auth/useragent'
import { Body, Controller, HttpCode, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { PasswordRecoveryService } from './password-recovery.service'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Сброс пароля')
@Controller('account')
export class PasswordRecoveryController {
	public constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

	@ApiOperation({ summary: 'Запрос на смену пароля пользователя' })
	@Post('reset-password')
	@HttpCode(200)
	public async resetPassword(@Body() dto: ResetPasswordDto, @Req() request: Request, @UserAgent() userAgent: string) {
		return this.passwordRecoveryService.resetPassword(dto, request, userAgent)
	}
	@ApiOperation({ summary: 'Смена пароля' })
	@ApiQuery({ name: 'Токен смены пароля', type: String })
	@Post('new-password')
	@HttpCode(200)
	public async changePassword(@Body() dto: NewPasswordDto, @Query('token') token: string) {
		return this.passwordRecoveryService.changePassword(dto, token)
	}
}
