import { DeliveryAddress } from 'prisma/generated'

export class DeliveryAddressEntity implements DeliveryAddress {
	id: string
	city: string
	street: string
	house: string
	flat: string

	accountId: string
	createdAt: Date
	updatedAt: Date
}
