import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { FileValidationPipe } from '@/shared/pipes/fileValidation.pipe'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiOperation } from '@nestjs/swagger'
import { ProductEntity } from '@/core/entities/product.entity'

@ApiTags('Продукты')
@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiOperation({ summary: 'Получение всех продуктов' })
	@ApiQuery({ name: 'categoryId', required: false })
	@ApiQuery({ name: 'search', required: false })
	@ApiQuery({ name: 'ingredientId', required: false })
	@ApiQuery({ name: 'orderBy', required: false })
	@HttpCode(200)
	@Get()
	public async getProducts(
		@Query('categoryId') categoryId?: string,
		@Query('search') search?: string,
		@Query('ingredientId') ingredientIds?: string,
		@Query('orderBy') orderBy?: 'asc' | 'desc',
		@Query('page') page?: number,
		@Query('limit') limit?: number
	) {
		return await this.productService.getProducts(categoryId, search, ingredientIds, orderBy, page, limit)
	}

	@ApiOperation({ summary: 'Получение самых популярных продуктов' })
	@ApiResponse({ status: 200, description: 'Успешный ответ', type: ProductEntity, isArray: true })
	@ApiResponse({ status: 404, description: 'Продукты не найдены' })
	@HttpCode(200)
	@Get('most-popular')
	public async getMostPopularProducts(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.productService.getMostPopularProducts(page, limit)
	}
	@HttpCode(201)
	@Post()
	@Authorization()
	public async createProduct(@Body() dto: ProductDto, @Req() request: Request) {
		return await this.productService.createProduct(dto, request)
	}

	@ApiOperation({ summary: 'Изменить фотографию' })
	@HttpCode(200)
	@Put('change/image')
	@UseInterceptors(FileInterceptor('file'))
	@Authorization()
	public async updateProductImage(
		@Query('productId') id: string,
		@UploadedFile(FileValidationPipe) file: Express.Multer.File,
		@Req() request: Request
	) {
		return await this.productService.updateProductImage(id, file, request)
	}

	@ApiOperation({ summary: 'Обновить продукт' })
	@HttpCode(200)
	@Put()
	@Authorization('ADMIN', 'SUPER_ADMIN')
	updateProduct(@Body() dto: ProductDto, @Query('productId') id: string) {
		return this.productService.updateProduct(id, dto)
	}

	@ApiOperation({ summary: 'Удалить продукт' })
	@HttpCode(200)
	@Delete()
	@Authorization('ADMIN', 'SUPER_ADMIN')
	public async removeProduct(@Query('productId') id: string) {
		return await this.productService.removeProduct(id)
	}

	@ApiOperation({ summary: 'Изменить статус продажи' })
	@HttpCode(200)
	@Put('sale-status')
	@Authorization('ADMIN', 'SUPER_ADMIN', 'MANAGER')
	toggleActiveProduct(@Query('productId') id: string) {
		return this.productService.toggleActiveProduct(id)
	}

	@ApiOperation({ summary: 'Получить похожие продукты' })
	@HttpCode(200)
	@Get('similar')
	public async getSimilarProducts(@Query('categoryId') categoryId: string, @Query('productId') productId: string) {
		return await this.productService.getSimilarProducts(categoryId, productId)
	}

	@ApiOperation({ summary: 'Получить продукт по Id' })
	@HttpCode(200)
	@Get(':productId')
	public async findProductById(@Param('productId') id: string) {
		return await this.productService.findProductById(id)
	}

	@ApiOperation({ summary: 'Получить средний рейтинг продукта' })
	@HttpCode(200)
	@Get('rating/:productId')
	public async getAvarageRatingByProductId(@Param('productId') id: string) {
		return await this.productService.getAvarageRatingByProductId(id)
	}
}
