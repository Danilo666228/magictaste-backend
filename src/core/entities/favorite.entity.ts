import { Exclude, Type } from 'class-transformer'
import { Favorite } from 'prisma/generated'
import { ProductEntity } from './product.entity'

export class FavoriteEntity implements Favorite {
	id: string
	@Exclude()
	productId: string
	@Exclude()
	accountId: string
	createdAt: Date
	updatedAt: Date
	@Type(() => ProductEntity)
	product: ProductEntity
}
