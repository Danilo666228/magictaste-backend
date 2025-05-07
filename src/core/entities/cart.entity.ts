import { Exclude, Type } from 'class-transformer'
import { Cart } from 'prisma/generated'
import { ProductEntity } from './product.entity'

export class CartEntity implements Cart {
	id: string
	@Exclude()
	accountId: string
	@Exclude()
	productId: string
	quantity: number
	createdAt: Date
	updatedAt: Date
	@Type(() => ProductEntity)
	product: ProductEntity
}
