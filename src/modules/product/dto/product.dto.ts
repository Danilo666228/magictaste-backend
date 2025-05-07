import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ProductDto {
	@IsString({ message: 'Название должно быть строкой' })
	@IsNotEmpty({ message: 'Название не может быть пустым' })
	title: string

	@IsOptional()
	description: string

	@IsNumber({}, { message: 'Вес должен быть числом' })
	@IsNotEmpty({ message: 'Вес не может быть пустой' })
	weight: number

	@IsNumber({}, { message: 'Цена должна быть числом' })
	@IsNotEmpty({ message: 'Цена не может быть пустой' })
	price: number

	@IsOptional()
	onSale: boolean

	@IsString({ message: 'Категория должна быть строкой' })
	@IsNotEmpty({ message: 'Категория не может быть пустой' })
	categoryId: string

	ingredients: {
		ingredientId: string
	}[]
}
