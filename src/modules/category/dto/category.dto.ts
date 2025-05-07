import { IsNotEmpty, IsString } from 'class-validator'

export class CategoryDto {
	@IsString({ message: 'Название должно быть строкой' })
	@IsNotEmpty({ message: 'Название не может быть пустым' })
	title: string
}
