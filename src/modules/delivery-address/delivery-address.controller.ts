import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common'
import { DeliveryAddressService } from './delivery-address.service'
import { CreateDeliveryAddressDto } from './dto/delivery-address.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Адрес доставки')
@Controller('delivery-address')
export class DeliveryAddressController {
	constructor(private readonly deliveryAddressService: DeliveryAddressService) {}

	@ApiOperation({ summary: 'Получить все адреса доставки пользователя' })
	@HttpCode(200)
	@Get('/all')
	@Authorization()
	public async getAllAdresses(@Authorized('id') accountId: string) {
		return await this.deliveryAddressService.findAddressesByAccountId(accountId)
	}

	@ApiOperation({ summary: 'Создать адрес доставки' })
	@HttpCode(200)
	@Post()
	@Authorization()
	public async create(@Authorized('id') accountId: string, @Body() dto: CreateDeliveryAddressDto) {
		return await this.deliveryAddressService.createDeliveryAddress(accountId, dto)
	}

	@ApiOperation({ summary: 'Удалить адрес доставки' })
	@HttpCode(200)
	@Delete('remove')
	@Authorization()
	public async delete(@Authorized('id') accountId: string, @Query('addressId') addressId: string) {
		return await this.deliveryAddressService.deleteAddress(accountId, addressId)
	}

	@ApiOperation({ summary: 'Получить адрес по Id' })
	@HttpCode(200)
	@Get(':deliveryAddressId')
	@Authorization()
	public async getDeliveryAddressById(@Param('deliveryAddressId') deliveryAddressId: string) {
		return await this.deliveryAddressService.findDeliveryAddressById(deliveryAddressId)
	}
}
