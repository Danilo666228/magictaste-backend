import { IngredientEntity } from '@/core/entities/ingredient.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../core/prisma/prisma.service'
import { StorageService } from '../libs/storage/storage.service'
import { IngredientDto } from './dto/ingredient.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class IngredientService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly notificationsService: NotificationsService
	) {}

	public async findIngredientById(id: string) {
		return await this.prismaService.ingredient.findUnique({
			where: {
				id
			},
			include: {
				productIngredients: true
			}
		})
	}

	async findIngredientByTitle(title: string) {
		const ingredient = await this.prismaService.ingredient.findFirst({
			where: {
				title
			}
		})

		return ingredient
	}

	public async createIngredient(dto: IngredientDto): Promise<boolean> {
		const existIngredient = await this.findIngredientByTitle(dto.title)

		if (existIngredient) {
			throw new BadRequestException('Ингредиент с таким названием уже существует')
		}

		await this.prismaService.ingredient.create({
			data: {
				title: dto.title
			}
		})
		return true
	}

	public async getIngredientByCategory(categoryId: string) {
		const ingredients = await this.prismaService.product.findMany({
			where: { categoryId },
			select: {
				ingredients: {
					select: {
						ingredient: true
					}
				}
			}
		})

		const uniqueIngredients = new Set()
		const result = []

		ingredients.forEach(product => {
			product.ingredients.forEach(({ ingredient }) => {
				const ingredientStr = JSON.stringify(ingredient)
				if (!uniqueIngredients.has(ingredientStr)) {
					uniqueIngredients.add(ingredientStr)
					result.push(ingredient)
				}
			})
		})

		return plainToInstance(IngredientEntity, result)
	}

	public async changeIngredientImage(id: string, file: Express.Multer.File): Promise<boolean> {
		const ingredient = await this.findIngredientById(id)

		if (ingredient.imageUrl) {
			await this.storageService.remove(ingredient.imageUrl)
		}

		const imageUrl = await this.storageService.uploadImage({
			buffer: file.buffer,
			key: `/ingredients/${id}`,
			contentType: 'image/webp'
		})

		await this.prismaService.ingredient.update({
			where: {
				id
			},
			data: {
				imageUrl
			}
		})

		return true
	}

	public async getIngredients(page: number = 1, limit: number = 10) {
		const ingredients = await this.prismaService.ingredient.findMany({
			...(page &&
				limit && {
					take: limit,
					skip: (page - 1) * limit
				})
		})
		const total = await this.prismaService.ingredient.count()
		return {
			ingredients: plainToInstance(IngredientEntity, ingredients),
			total
		}
	}

	public async removeIngredient(id: string): Promise<boolean> {
		const ingredient = await this.findIngredientById(id)

		if (ingredient.productIngredients.length > 0) {
			throw new BadRequestException('Ингредиент используется в продуктах')
		}

		if (ingredient.imageUrl) {
			await this.storageService.remove(ingredient.imageUrl)
		}

		await this.prismaService.ingredient.delete({
			where: {
				id
			}
		})

		return true
	}

	public async updateIngredient(id: string, dto: IngredientDto) {
		return await this.prismaService.ingredient.update({
			where: {
				id
			},
			data: {
				title: dto.title
			}
		})
	}
}
