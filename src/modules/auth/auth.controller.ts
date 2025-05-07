import { Authorization } from '@/shared/decorators/auth/auth.decorator'

import { UserAgent } from '@/shared/decorators/auth/useragent'
import { Body, Controller, Delete, Get, HttpCode, Post, Req, UseGuards, BadRequestException } from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { Request } from 'express'
import { SignInDto } from './account/dto/sign-in.dto'
import { SignUpDto } from './account/dto/sign-up.dto'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiBody({ type: SignUpDto })
	@HttpCode(201)
	@Recaptcha()
	@Post('sign-up')
	public async signUp(@Body() dto: SignUpDto, @Req() request: Request, @UserAgent() userAgent: string) {
		return await this.authService.signUp(dto, request, userAgent)
	}

	@ApiOperation({ summary: 'Авторизация пользователя' })
	@HttpCode(200)
	@Recaptcha()
	@Post('sign-in')
	public async signIn(@Body() dto: SignInDto, @Req() request: Request, @UserAgent() userAgent: string) {
		return await this.authService.signIn(dto, request, userAgent)
	}

	@ApiOperation({ summary: 'Выход из аккаунта' })
	@HttpCode(200)
	@Authorization()
	@Delete('logout')
	public async logout(@Req() request: Request) {
		return await this.authService.logout(request)
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	public async googleAuthCallback(@Req() req) {
		if (!req.user) {
			throw new BadRequestException('Не удалось получить данные профиля Google')
		}
		console.log(req.user)
		return await this.authService.handleGoogleAuth(req)
	}
	@Get('google')
	@UseGuards(AuthGuard('google'))
	public async googleAuth() {}
}
