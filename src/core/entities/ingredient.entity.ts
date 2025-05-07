import { Ingredient } from 'prisma/generated'

export class IngredientEntity implements Ingredient {
	id: string
	title: string
	imageUrl: string
	createdAt: Date
	updatedAt: Date
}
