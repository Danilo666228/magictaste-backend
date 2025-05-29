import { AccountEntity } from '@/core/entities/account.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { FileValidationPipe } from '@/shared/pipes/fileValidation.pipe'
import { Body, Controller, Delete, Get, HttpCode, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Account } from 'prisma/generated'
import { AccountService } from '../account/account.service'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { TwoFactorEmailDto } from './dto/two-factor-email.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileService } from './profile.service'

@ApiTags('Профиль')
@Controller('profile')
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly accountService: AccountService
	) {}

	@ApiOperation({
		summary: 'Обновить профиль пользователя',
		description: 'Обновить userName и email'
	})
	@HttpCode(200)
	@Authorization()
	@Put()
	public async updateProfile(@Authorized() account: AccountEntity, @Body() dto: UpdateProfileDto) {
		return await this.profileService.updateProfile(account, dto)
	}

	@ApiOperation({ summary: 'Получить профиль пользователя' })
	@HttpCode(200)
	@Authorization()
	@Get()
	public async getProfile(@Authorized('id') accountId: string) {
		return await this.accountService.findAccountById(accountId)
	}

	@ApiOperation({
		summary: 'Изменение настроек 2FA по Email',
		description: 'Позволяет пользователю включить или отключить двухфакторную аутентификацию по email'
	})
	@ApiBody({
		type: TwoFactorEmailDto,
		description: 'Данные для обновления настроек 2FA'
	})
	@HttpCode(200)
	@Authorization()
	@Put('two-factor/email')
	public async updateTwoFactorEmail(@Authorized() account: AccountEntity, @Body() dto: TwoFactorEmailDto) {
		return await this.profileService.updateTwoFactorEmailSettings(account, dto)
	}

	@ApiOperation({
		summary: 'Изменение настроек уведомлений пользователя'
	})
	@HttpCode(200)
	@Authorization()
	@Put('notification')
	public async changeNotificationSettings(@Body() dto: NotificationSettingsDto, @Authorized() account: AccountEntity) {
		return await this.profileService.changeNotificationSettings(dto, account)
	}

	@ApiOperation({
		summary: 'Сменить пароль пользователя'
	})
	@HttpCode(200)
	@Authorization()
	@Put('password')
	public async updatePassword(@Authorized() account: AccountEntity, @Body() dto: UpdatePasswordDto) {
		return await this.profileService.updatePassword(account, dto)
	}

	@ApiOperation({ summary: 'Сменить фотографию профиля' })
	@HttpCode(200)
	@Put('avatar')
	@Authorization()
	@UseInterceptors(FileInterceptor('file'))
	public async updateAvatar(@Authorized() account: Account, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {
		return await this.profileService.updateAvatar(account, file)
	}

	@ApiOperation({ summary: 'Удалить фотографию профиля' })
	@HttpCode(200)
	@Delete('avatar')
	@Authorization()
	public async removeAvatar(@Authorized() account: Account) {
		return await this.profileService.removeAvatar(account)
	}
}
