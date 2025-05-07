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
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Категории')
@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@ApiOperation({ summary: 'Популярные категории' })
	@HttpCode(200)
	@Get('popular')
	public async getMostPopularCategories() {
		return await this.categoryService.getMostPopularCategories()
	}

	@ApiOperation({ summary: 'Создать категорию' })
	@HttpCode(201)
	@Post()
	createCategory(@Body() dto: CategoryDto, @Req() request: Request) {
		return this.categoryService.createCategory(dto, request)
	}

	@ApiOperation({ summary: 'Получить все категории' })
	@HttpCode(200)
	@Get()
	public async getCategories(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.categoryService.getCategories(page, limit)
	}

	@ApiOperation({ summary: 'Удалить категорию' })
	@HttpCode(200)
	@Delete()
	removeCategory(@Query('categoryId') id: string) {
		return this.categoryService.removeCategory(id)
	}

	@ApiOperation({ summary: 'Изменить фотографию', deprecated: true })
	@HttpCode(200)
	@Put('change/image')
	@UseInterceptors(FileInterceptor('file'))
	changeCategoryImage(@UploadedFile() file: Express.Multer.File, @Query('categoryId') id: string) {
		return this.categoryService.changeCategoryImage(id, file)
	}

	@ApiOperation({ summary: 'Изменить категорию' })
	@HttpCode(200)
	@Put()
	updateCategory(@Body() dto: CategoryDto, @Query('categoryId') id: string) {
		return this.categoryService.updateCategory(id, dto)
	}

	@ApiOperation({ summary: 'Получить категорию по Id' })
	@HttpCode(200)
	@Get(':categoryId')
	public async findCategoryById(@Param('categoryId') id: string) {
		return await this.categoryService.getCategoryById(id)
	}
}
