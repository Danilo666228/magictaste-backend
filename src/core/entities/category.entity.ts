import { Type } from 'class-transformer'
import { Category } from 'prisma/generated'
import { ProductEntity } from './product.entity'

export class CategoryEntity implements Category {
	id: string
	title: string
	imageUrl: string
	createdAt: Date
	updatedAt: Date
	@Type(() => ProductEntity)
	products: ProductEntity[]
}
