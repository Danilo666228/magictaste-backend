import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { IngredientDto } from './dto/ingredient.dto'
import { IngredientService } from './ingredient.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Ингредиенты')
@Controller('ingredients')
export class IngredientController {
	constructor(private readonly ingredientService: IngredientService) {}

	@ApiOperation({ summary: 'Создать ингредиент' })
	@HttpCode(201)
	@Post()
	@Authorization()
	createIngredient(@Body() dto: IngredientDto) {
		return this.ingredientService.createIngredient(dto)
	}

	@ApiOperation({ summary: 'Получить ингредиенты по категории' })
	@HttpCode(200)
	@Get('by-category/:categoryId')
	getIngredientByCategory(@Param('categoryId') categoryId: string) {
		return this.ingredientService.getIngredientByCategory(categoryId)
	}

	@ApiOperation({ summary: 'Получить все ингредиенты' })
	@HttpCode(200)
	@Get()
	public async getIngredients(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.ingredientService.getIngredients(page, limit)
	}

	@ApiOperation({ summary: 'Изменить фотографию ингредиента' })
	@HttpCode(200)
	@Put('change/image')
	@UseInterceptors(FileInterceptor('file'))
	changeIngredientImage(@UploadedFile() file: Express.Multer.File, @Query('ingredientId') id: string) {
		return this.ingredientService.changeIngredientImage(id, file)
	}

	@ApiOperation({ summary: 'Удалить ингредиент' })
	@HttpCode(200)
	@Authorization()
	@Delete()
	removeIngredient(@Query('ingredientId') id: string) {
		return this.ingredientService.removeIngredient(id)
	}

	@ApiOperation({ summary: 'Обновить игредиент' })
	@HttpCode(200)
	@Authorization()
	@Put()
	updateIngredient(@Query('ingredientId') id: string, @Body() dto: IngredientDto) {
		return this.ingredientService.updateIngredient(id, dto)
	}
}
