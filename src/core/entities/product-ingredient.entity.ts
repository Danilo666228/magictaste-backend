import { ProductIngredients } from 'prisma/generated'
import { IngredientEntity } from './ingredient.entity'

export class ProductIngredientEntity implements ProductIngredients {
	id: string
	ingredientId: string
	ingredient: IngredientEntity[]
	productId: string
	createdAt: Date
	updatedAt: Date
}
