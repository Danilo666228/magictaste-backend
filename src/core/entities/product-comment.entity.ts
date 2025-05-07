import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { ProductComment } from 'prisma/generated'
import { AccountEntity } from './account.entity'
import { ProductEntity } from './product.entity'

export class ProductCommentEntity implements ProductComment {
	@ApiProperty({
		description: 'Идентификатор комментария',
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	id: string
	@ApiProperty({
		description: 'Комментарий',
		example: 'Отличный продукт'
	})
	comment: string
	@ApiProperty({
		description: 'Рейтинг',
		example: 5
	})
	rating: number
	@ApiProperty({
		description: 'Идентификатор родительского комментария',
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	parentId: string

	@ApiProperty({
		description: 'Дата обновления комментария',
		example: '2021-01-01T00:00:00.000Z'
	})
	updatedAt: Date
	@ApiProperty({
		description: 'Дата создания комментария',
		example: '2021-01-01T00:00:00.000Z'
	})
	createdAt: Date
	@ApiProperty({
		description: 'Автор комментария',
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	@Type(() => AccountEntity)
	account: AccountEntity
	@ApiProperty({
		description: 'Продукт',
		example: '123e4567-e89b-12d3-a456-426614174000'
	})
	@Type(() => ProductEntity)
	product: ProductEntity

	@Exclude()
	accountId: string
	@Exclude()
	productId: string
}
