import { ProductEntity } from '@/core/entities/product.entity'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Request } from 'express'
import { Prisma, Product } from 'prisma/generated'
import { PrismaService } from '../../core/prisma/prisma.service'
import { StorageService } from '../libs/storage/storage.service'
import { NotificationsService } from '../notifications/notifications.service'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly notificationsService: NotificationsService
	) {}

	public async findProductById(id: string) {
		const product = await this.prismaService.product.findUnique({
			where: { id },
			include: { ingredients: { include: { ingredient: true } }, category: true, comments: true }
		})
		return plainToInstance(ProductEntity, product)
	}

	public async createProduct(dto: ProductDto, request: Request) {
		const product = await this.prismaService.product.create({
			data: {
				title: dto.title,
				description: dto.description,
				price: dto.price,
				categoryId: dto.categoryId,
				weight: dto.weight,
				onSale: dto.onSale,
				ingredients: {
					createMany: {
						data: dto.ingredients
					}
				}
			}
		})

		await this.notificationsService.create({
			accountId: request.session.accountId,
			title: 'Создание продукта',
			message: 'Продукт успешно создан',
			type: 'success'
		})

		return plainToInstance(ProductEntity, product)
	}

	public async updateProductImage(productId: string, file: Express.Multer.File, request: Request) {
		const product = await this.findProductById(productId)

		if (product.imageUrl) {
			await this.storageService.remove(product.imageUrl)
		}

		const imageUrl = await this.storageService.uploadImage({
			buffer: file.buffer,
			key: `/products/${productId}/image/${file.originalname.split('.')[0]}.webp`,
			contentType: 'image/webp'
		})

		await this.notificationsService.create({
			accountId: request.session.accountId,
			title: 'Обновление изображения продукта',
			message: 'Изображение продукта успешно обновлено',
			type: 'success'
		})

		return this.prismaService.product.update({
			where: {
				id: productId
			},
			data: {
				imageUrl
			}
		})
	}

	async toggleActiveProduct(id: string) {
		const currentProduct = await this.prismaService.product.findUnique({
			where: {
				id
			}
		})

		if (currentProduct.onSale) {
			return this.prismaService.product.update({
				where: {
					id
				},
				data: {
					onSale: false
				}
			})
		}

		return this.prismaService.product.update({
			where: {
				id
			},
			data: {
				onSale: true
			}
		})
	}

	public async removeProduct(id: string) {
		const product = await this.findProductById(id)

		if (product.imageUrl) {
			await this.storageService.remove(product.imageUrl)
		}

		return this.prismaService.product.delete({
			where: {
				id
			}
		})
	}

	public async updateProduct(id: string, dto: ProductDto) {
		return await this.prismaService.product.update({
			where: {
				id
			},
			data: {
				title: dto.title,
				description: dto.description,
				categoryId: dto.categoryId,
				ingredients: {
					deleteMany: {},
					createMany: {
						data: dto.ingredients.map(ingredient => ({
							ingredientId: ingredient.ingredientId
						}))
					}
				},
				weight: dto.weight,
				price: dto.price,
				onSale: dto.onSale
			}
		})
	}

	public async getProducts(
		categoryId?: string,
		search?: string,
		ingredientId?: string,
		orderBy?: 'asc' | 'desc',
		page: number = 1,
		limit: number = 10
	) {
		const where: Prisma.ProductWhereInput = {}

		if (categoryId) {
			where.categoryId = categoryId
		}

		if (search) {
			where.title = {
				contains: search,
				mode: 'insensitive'
			}
		}

		if (ingredientId) {
			where.ingredients = {
				some: {
					ingredientId: {
						in: ingredientId.split(',').map(id => id.trim())
					}
				}
			}
		}

		const skip = (page - 1) * limit

		const [products, total] = await Promise.all([
			this.prismaService.product.findMany({
				where,
				include: {
					ingredients: {
						include: {
							ingredient: true
						}
					},
					category: true
				},
				orderBy: [{ price: orderBy }, { createdAt: 'desc' }],
				skip,
				take: limit
			}),
			this.prismaService.product.count({ where })
		])

		return {
			products: plainToInstance(ProductEntity, products),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit)
		}
	}

	public async getSimilarProducts(categoryId: string, productId: string) {
		const currentProduct = await this.findProductById(productId)

		const similarProducts = await this.prismaService.product.findMany({
			where: {
				categoryId,
				NOT: {
					id: productId
				},
				ingredients: {
					some: {
						ingredientId: {
							in: currentProduct.ingredients.map(ingredient => ingredient.id)
						}
					}
				}
			},
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				},
				category: true
			}
		})

		return plainToInstance(ProductEntity, similarProducts)
	}

	public async getMissingProducts(products: Product[]) {
		const categories = products.map(product => product.categoryId)
		const missingProductsWithCategoryDrinks = await this.prismaService.product.findMany({
			where: {
				NOT: {
					id: {
						in: products.map(product => product.id)
					}
				},
				categoryId: {
					in: categories,
					contains: 'Напитки'
				}
			},
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				},
				category: true
			}
		})

		return plainToInstance(ProductEntity, missingProductsWithCategoryDrinks)
	}

	public async getAvarageRatingByProductId(productId: string) {
		const rating = await this.prismaService.productComment.findMany({
			where: { productId },
			select: {
				rating: true
			}
		})

		return rating.reduce((acc, review) => acc + review.rating, 0) / rating.length
	}

	public async getMostPopularProducts(page: number = 1, limit: number = 10) {
		const products = await this.prismaService.product.findMany({
			include: {
				comments: {
					orderBy: {
						comment: 'asc'
					}
				}
			},
			take: limit ?? undefined,
			skip: page ? (page - 1) * limit : undefined
		})

		return products
		// return plainToInstance(ProductEntity, products)
	}
}
