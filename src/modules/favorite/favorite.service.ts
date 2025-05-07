import { FavoriteEntity } from '@/core/entities/favorite.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../core/prisma/prisma.service'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class FavoriteService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

	public async toggleFavorite(productId: string, accountId: string) {
		const product = await this.prismaService.product.findUnique({
			where: {
				id: productId
			}
		})

		if (!product) {
			throw new NotFoundException('Товар не найден. Пожалуйста, проверьте введенные данные.')
		}

		const existProduct = await this.prismaService.favorite.findFirst({
			where: {
				productId,
				accountId
			}
		})

		if (existProduct) {
			await this.prismaService.favorite.delete({
				where: {
					id: existProduct.id
				}
			})

			return {
				favorite: false
			}
		}

		await this.prismaService.favorite.create({
			data: {
				productId,
				accountId
			}
		})

		await this.notificationsService.create({
			accountId,
			title: 'Избранное',
			message: 'Товар добавлен в избранное'
		})

		return {
			favorite: true
		}
	}

	public async getFavoriteProducts(accountId: string, search?: string): Promise<FavoriteEntity[]> {
		const favoriteProducts = await this.prismaService.favorite.findMany({
			where: {
				accountId,
				product: {
					title: {
						contains: search ?? undefined
					}
				}
			},
			include: {
				product: {
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

		return plainToInstance(FavoriteEntity, favoriteProducts)
	}
}
