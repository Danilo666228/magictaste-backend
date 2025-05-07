import { AccountEntity } from '@/core/entities/account.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { EnableTotpDto } from './dto/enableTotp.dto'
import { TotpService } from './totp.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('2FA TOTP')
@Controller('totp')
export class TotpController {
	constructor(private readonly totpService: TotpService) {}

	@ApiOperation({
		summary: 'Сгенерировать QRCode для TOTP'
	})
	@HttpCode(200)
	@Get('qr-code')
	@Authorization()
	public async getQrCode(@Authorized() account: AccountEntity) {
		return await this.totpService.generateTotpSecret(account)
	}

	@ApiOperation({
		summary: 'Активировать TOTP'
	})
	@HttpCode(200)
	@Post('enable')
	@Authorization()
	public async enableTotp(@Body() dto: EnableTotpDto, @Authorized() account: AccountEntity) {
		return await this.totpService.enableTotp(account, dto)
	}

	@ApiOperation({
		summary: 'Деактивировать TOTP'
	})
	@HttpCode(200)
	@Post('disable')
	@Authorization()
	public async disableTotp(@Authorized() account: AccountEntity) {
		return await this.totpService.disableTotp(account)
	}
}
