import { CategoryEntity } from '@/core/entities/category.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '@/core/prisma/prisma.service'
import { StorageService } from '../libs/storage/storage.service'
import { CategoryDto } from './dto/category.dto'
import { NotificationsService } from '../notifications/notifications.service'
import { Request } from 'express'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly notificationsService: NotificationsService
	) {}

	public async findCategoryById(id: string) {
		return this.prismaService.category.findUnique({
			where: {
				id
			},
			include: {
				products: {
					include: {
						ingredients: {
							include: {
								ingredient: true
							}
						}
					}
				}
			}
		})
	}

	public async getCategoryById(id: string) {
		const category = await this.findCategoryById(id)

		return plainToInstance(CategoryEntity, category)
	}

	public async createCategory(dto: CategoryDto, request: Request): Promise<boolean> {
		const category = await this.prismaService.category.findUnique({
			where: {
				title: dto.title
			}
		})

		if (category) {
			await this.notificationsService.create({
				accountId: request.session.id,
				title: 'Создание категории',
				message: 'Категория с таким названием уже существует',
				type: 'error'
			})
			throw new BadRequestException('Категория с таким названием уже существует')
		}

		await this.prismaService.category.create({
			data: {
				title: dto.title
			}
		})

		return true
	}

	public async getCategories(page: number = 1, limit: number = 10) {
		const categories = await this.prismaService.category.findMany({
			include: {
				products: {
					where: {
						onSale: true
					},
					include: {
						ingredients: {
							include: {
								ingredient: true
							}
						}
					}
				}
			},
			...(page &&
				limit && {
					take: limit,
					skip: (page - 1) * limit
				})
		})
		const total = await this.prismaService.category.count()

		return {
			categories,
			total
		}
	}

	public async changeCategoryImage(id: string, file: Express.Multer.File) {
		const category = await this.prismaService.category.findUnique({
			where: {
				id
			}
		})

		if (category.imageUrl) {
			await this.storageService.remove(category.imageUrl)
		}

		const imageUrl = await this.storageService.uploadImage({
			buffer: file.buffer,
			key: `/categories/${id}/image/${file.originalname.split('.')[0]}.webp`,
			contentType: 'image/webp'
		})

		return this.prismaService.category.update({
			where: {
				id
			},
			data: {
				imageUrl
			}
		})
	}

	public async removeCategory(id: string, request: Request) {
		const category = await this.prismaService.category.findUnique({
			where: {
				id
			},
			include: {
				products: true
			}
		})

		if (category.products.length > 0) {
			await this.notificationsService.create({
				accountId: request.session.accountId,
				title: 'Удаление категории',
				message: 'Категория не может быть удалена, в ней есть продукты',
				type: 'error'
			})
			throw new BadRequestException('Категория не может быть удалена, пока есть продукты в ней')
		}

		if (category.imageUrl) {
			await this.storageService.remove(category.imageUrl)
		}

		return this.prismaService.category.delete({
			where: {
				id
			}
		})
	}

	public async updateCategory(id: string, dto: CategoryDto) {
		return this.prismaService.category.update({
			where: {
				id
			},
			data: {
				title: dto.title
			}
		})
	}

	public async getMostPopularCategories(limit: number = 4) {
		const categories = await this.prismaService.category.findMany({
			include: {
				products: {
					where: {
						onSale: true
					},
					include: {
						orderItem: true,
						ingredients: {
							include: {
								ingredient: true
							}
						}
					}
				}
			}
		})

		// Подсчитываем общее количество продаж для каждой категории
		const categoriesWithSales = categories.map(category => {
			const totalSales = category.products.reduce((sum, product) => {
				return sum + product.orderItem.length
			}, 0)

			return {
				...category,
				totalSales
			}
		})

		// Сортируем категории по количеству продаж (по убыванию)
		const sortedCategories = categoriesWithSales.sort((a, b) => b.totalSales - a.totalSales)

		// Возвращаем только запрошенное количество категорий
		const topCategories = sortedCategories.slice(0, limit)

		return plainToInstance(CategoryEntity, topCategories)
	}
}
