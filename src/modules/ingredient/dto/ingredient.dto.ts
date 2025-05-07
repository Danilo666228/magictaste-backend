import { IsNotEmpty, IsString } from 'class-validator'

export class IngredientDto {
	@IsString({ message: 'Название должно быть строкой' })
	@IsNotEmpty({ message: 'Название не может быть пустым' })
	title: string
}
