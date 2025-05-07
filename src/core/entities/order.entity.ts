import { Exclude, Type } from 'class-transformer'
import { DeliveryType, Order, OrderStatus, PaymentMethod, PaymentStatus } from 'prisma/generated'
import { JsonValue } from 'prisma/generated/runtime/library'
import { ProductEntity } from './product.entity'

export class OrderEntity implements Order {
	id: string
	email: string
	lastName: string
	@Exclude()
	accountId: string
	createdAt: Date
	deliveryAddress: JsonValue
	deliveryAddressId: string
	firstName: string
	phone: string
	status: OrderStatus
	total: number
	updatedAt: Date
	@Type(() => OrderItemEntity)
	items: OrderItemEntity[]
	comment: string
	paymentMethod: PaymentMethod
	paymentStatus: PaymentStatus
	deliveryType: DeliveryType
}

class OrderItemEntity {
	id: string
	@Exclude()
	orderId: string
	@Type(() => ProductEntity)
	product: ProductEntity
	@Exclude()
	productId: string
	quantity: number
	createdAt: Date
	updatedAt: Date
}
