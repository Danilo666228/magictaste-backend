import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common'
import { Request } from 'express'

import { UserAgent } from '@/shared/decorators/auth/useragent'
import { VerificationService } from './verification.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Верификация')
@Controller('auth/verification')
export class VerificationController {
	constructor(private readonly verifyService: VerificationService) {}

	@ApiOperation({
		summary: 'Верификация аккаунта'
	})
	@HttpCode(200)
	@Get()
	public async verifyEmail(@Req() request: Request, @Query('token') token: string, @UserAgent() userAgent: string) {
		return await this.verifyService.verifyEmail(request, token, userAgent)
	}
}
