import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query } from '@nestjs/common'

import { ProductCommentEntity } from '@/core/entities/product-comment.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProductCommentDto } from './dto/product-comment.dto'
import { ProductCommentService } from './product-comment.service'

@ApiTags('Комментарии к продуктам')
@Controller('product-comments')
export class ProductCommentController {
	constructor(private readonly productCommentService: ProductCommentService) {}

	@ApiOperation({ summary: 'Создать комментарий' })
	@ApiResponse({ status: 201, type: Boolean })
	@ApiResponse({ status: 400, description: 'Неверные данные' })
	@ApiQuery({ name: 'productId', type: String, description: 'Идентификатор продукта' })
	@HttpCode(201)
	@Post('comment')
	@Authorization()
	public async createComment(
		@Authorized('id') accountId: string,
		@Query('productId') productId: string,
		@Body() dto: ProductCommentDto
	) {
		return await this.productCommentService.createProductComment(accountId, productId, dto)
	}

	@ApiOperation({ summary: 'Создать ответ на комментарий' })
	@ApiResponse({ status: 201, description: 'Ответ на комментарий успешно создан' })
	@ApiResponse({ status: 400, description: 'Неверные данные' })
	@ApiQuery({ name: 'productId', type: String, description: 'Идентификатор продукта' })
	@ApiQuery({ name: 'parentId', type: String, description: 'Идентификатор родительского комментария' })
	@HttpCode(201)
	@Post('comment/reply')
	@Authorization()
	public async createCommentReply(
		@Authorized('id') accountId: string,
		@Query('productId') productId: string,
		@Query('parentId') parentId: string,
		@Body() dto: ProductCommentDto
	) {
		return await this.productCommentService.createCommentReply(accountId, productId, parentId, dto)
	}

	@ApiOperation({ summary: 'Получить комментарии к продукту' })
	@ApiResponse({ status: 200, type: ProductCommentEntity, description: 'Комментарии успешно получены' })
	@ApiQuery({ name: 'productId', type: String, description: 'Идентификатор продукта' })
	@ApiQuery({ name: 'includeReplies', type: Boolean, description: 'Включить ответы на комментарии' })
	@HttpCode(200)
	@Get('comments')
	public getCommentsByProductId(@Query('productId') productId: string, @Query('includeReplies') includeReplies?: boolean) {
		return this.productCommentService.getProductCommentsByProductId(productId, includeReplies)
	}

	@ApiOperation({ summary: 'Обновить комментарий' })
	@ApiResponse({ status: 200, description: 'Комментарий успешно обновлен' })
	@ApiResponse({ status: 400, description: 'Неверные данные' })
	@ApiQuery({ name: 'commentId', type: String, description: 'Идентификатор комментария' })
	@ApiQuery({ name: 'productId', type: String, description: 'Идентификатор продукта' })
	@HttpCode(200)
	@Put('comment')
	@Authorization()
	public async updateComment(
		@Authorized('id') accountId: string,
		@Query('commentId') commentId: string,
		@Query('productId') productId: string,
		@Body() dto: ProductCommentDto
	) {
		return this.productCommentService.updateProductComment(commentId, accountId, productId, dto)
	}

	@ApiOperation({ summary: 'Удалить комментарий' })
	@ApiResponse({ status: 200, description: 'Комментарий успешно удален' })
	@ApiResponse({ status: 400, description: 'Неверные данные' })
	@ApiQuery({ name: 'commentId', type: String, description: 'Идентификатор комментария' })
	@HttpCode(200)
	@Delete('comment')
	@Authorization()
	public async deleteComment(@Authorized('id') accountId: string, @Query('commentId') commentId: string) {
		return await this.productCommentService.deleteProductComment(commentId, accountId)
	}
}
