import { Exclude, Transform, Type } from 'class-transformer'
import { Product } from 'prisma/generated'
import { ProductIngredientEntity } from './product-ingredient.entity'
import { CategoryEntity } from './category.entity'

export class ProductEntity implements Product {
	id: string
	title: string
	@Exclude()
	categoryId: string
	createdAt: Date
	description: string
	imageUrl: string
	onSale: boolean
	price: number
	updatedAt: Date
	weight: number
	@Transform(({ value }) => value.map(({ ingredient }) => ingredient))
	ingredients: ProductIngredientEntity[]
	@Type(() => CategoryEntity)
	category: CategoryEntity
}
