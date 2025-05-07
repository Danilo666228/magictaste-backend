import { IsEnum, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { OrderStatus, PaymentMethod, PaymentStatus } from 'prisma/generated'

export class UpdateOrderDto {
	@IsString()
	@IsOptional()
	firstName?: string

	@IsPhoneNumber('RU')
	@IsOptional()
	phone?: string

	@IsString()
	@IsOptional()
	deliveryAddressId?: string

	@IsObject()
	@IsOptional()
	deliveryAddress?: any

	@IsEnum(PaymentMethod)
	@IsOptional()
	paymentMethod?: PaymentMethod

	@IsEnum(PaymentStatus)
	@IsOptional()
	paymentStatus?: PaymentStatus

	@IsEnum(OrderStatus)
	@IsOptional()
	status?: OrderStatus

	@IsString()
	@IsOptional()
	comment?: string

	@IsNumber()
	@IsOptional()
	total?: number
}
