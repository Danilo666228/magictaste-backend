import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class ProductCommentDto {
	@ApiProperty({
		description: 'Комментарий',
		example: 'Отличный продукт'
	})
	@IsString()
	comment: string

	@ApiProperty({
		description: 'Рейтинг',
		example: 5,
		required: false
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(5)
	rating?: number
}
