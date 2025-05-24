import { Type } from 'class-transformer'
import {
	IsArray,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsString,
	ValidateNested,
	IsBoolean
} from 'class-validator'
import { DeliveryType, OrderStatus, PaymentMethod } from 'prisma/generated'

class OrderItemDto {
	@IsString()
	@IsNotEmpty()
	productId: string

	@IsNumber()
	@IsNotEmpty()
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	price: number
}

export class OrderDto {
	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsPhoneNumber('RU')
	@IsNotEmpty()
	phone: string

	@IsString()
	@IsNotEmpty()
	lastName: string

	@IsEmail()
	@IsOptional()
	email?: string

	@IsOptional()
	@IsString()
	comment?: string

	@IsOptional()
	@IsEnum(PaymentMethod)
	paymentMethod?: PaymentMethod

	@IsOptional()
	@IsEnum(DeliveryType)
	deliveryType?: DeliveryType

	@IsOptional()
	@IsString()
	deliveryAddressId?: string

	@IsOptional()
	deliveryAddress?: any

	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[]

	@IsNumber()
	@IsNotEmpty()
	totalPrice: number

	@IsOptional()
	@IsBoolean()
	useLoyaltyPoints?: boolean
}
