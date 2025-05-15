import { DeliveryAddressEntity } from '@/core/entities/delivery-address.entity'
import { PrismaService } from '@/core/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { NotificationsService } from '../notifications/notifications.service'
import { CreateDeliveryAddressDto } from './dto/delivery-address.dto'

@Injectable()
export class DeliveryAddressService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

	public async createDeliveryAddress(accountId: string, dto: CreateDeliveryAddressDto) {
		await this.prismaService.deliveryAddress.create({
			data: {
				city: dto.city,
				street: dto.street,
				house: dto.house,
				flat: dto.flat,
				accountId
			}
		})

		await this.notificationsService.create({
			accountId,
			title: 'Адрес доставки',
			message: 'Адрес доставки успешно добавлен, теперь вы можете изпользовать его при оформлении заказа',
			type: 'success'
		})

		return true
	}

	public async findAddressesByAccountId(accountId: string) {
		const addresses = await this.prismaService.deliveryAddress.findMany({
			where: {
				accountId
			}
		})
		return plainToInstance(DeliveryAddressEntity, addresses)
	}

	public async findDeliveryAddressById(id: string) {
		const deliveryAddress = await this.prismaService.deliveryAddress.findFirst({
			where: { id }
		})

		return plainToInstance(DeliveryAddressEntity, deliveryAddress)
	}

	public async deleteAddress(accountId: string, addressId: string) {
		const addressWithOrders = await this.prismaService.order.findMany({
			where: {
				deliveryAddressId: addressId,
				accountId
			}
		})
		if (addressWithOrders.length) {
			await this.notificationsService.create({
				accountId,
				title: 'Удаление адреса',
				message: 'Нельзя удалить адрес который испольузется в существующем заказе'
			})

			throw new BadRequestException('Этот адрес нельзя удалить, он используется в существующем заказе')
		}
		await this.prismaService.deliveryAddress.delete({
			where: {
				id: addressId,
				accountId
			}
		})
		await this.notificationsService.create({
			accountId,
			title: 'Адрес доставки',
			message: 'Адрес доставки успешно удален',
			type: 'success'
		})

		return true
	}
}
