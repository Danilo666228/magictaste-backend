import { ProductCommentEntity } from '@/core/entities/product-comment.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../../core/prisma/prisma.service'
import { NotificationsService } from '../notifications/notifications.service'
import { ProductCommentDto } from './dto/product-comment.dto'
import { LoyaltyService } from '../loyalty/loyalty.service'

@Injectable()
export class ProductCommentService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService,
		private readonly loyaltyService: LoyaltyService
	) {}

	public async createProductComment(accountId: string, productId: string, dto: ProductCommentDto) {
		const existingMainComment = await this.prismaService.productComment.findFirst({
			where: {
				accountId,
				productId,
				parentId: null
			}
		})

		if (existingMainComment) {
			await this.notificationsService.create({
				accountId: accountId,
				title: 'Создание комментария',
				message: 'Вы уже оставили основной комментарий к этому продукту',
				type: 'error'
			})
			throw new BadRequestException('Вы уже оставили основной комментарий к этому продукту')
		}

		const comment = await this.prismaService.productComment.create({
			data: {
				accountId,
				productId,
				comment: dto.comment,
				rating: dto.rating
			}
		})

		await this.loyaltyService.addPoints(accountId, {
			points: 10,
			type: 'REVIEW',
			description: `Бонусные баллы за оставление комментария`
		})

		await this.notificationsService.create({
			accountId,
			title: 'Коментарий',
			message: 'Коментарий успешно добавлен, на вашу карту лояльности начислено 10 балов'
		})

		return plainToInstance(ProductCommentEntity, comment)
	}

	public async createCommentReply(accountId: string, productId: string, parentId: string, dto: ProductCommentDto) {
		const parentComment = await this.prismaService.productComment.findFirst({
			where: {
				id: parentId,
				productId
			}
		})

		if (!parentComment) {
			throw new BadRequestException('Родительский комментарий не найден')
		}

		if (parentComment.parentId) {
			throw new BadRequestException('Нельзя ответить на ответ. Можно отвечать только на основные комментарии')
		}

		const reply = await this.prismaService.productComment.create({
			data: {
				accountId,
				productId,
				comment: dto.comment,
				parentId
			},
			include: {
				account: true
			}
		})

		return plainToInstance(ProductCommentEntity, reply)
	}

	public async getProductCommentsByProductId(productId: string, includeReplies?: boolean) {
		const comment = await this.prismaService.productComment.findMany({
			where: { productId, parentId: null },
			include: {
				account: {
					include: {
						roles: {
							include: {
								role: true
							}
						}
					}
				},
				product: {
					include: {
						category: true
					}
				},
				...(includeReplies && {
					replies: {
						include: {
							account: true
						}
					}
				})
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return plainToInstance(ProductCommentEntity, comment)
	}

	public getCommentReplies(commentId: string) {
		const replies = this.prismaService.productComment.findMany({
			where: {
				parentId: commentId
			},
			include: {
				account: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return plainToInstance(ProductCommentEntity, replies)
	}

	public updateProductComment(commentId: string, accountId: string, productId: string, dto: ProductCommentDto) {
		const currentComment = this.prismaService.productComment.findFirst({
			where: {
				id: commentId,
				accountId
			}
		})

		if (!currentComment) {
			throw new BadRequestException('Комментарий не найден')
		}

		const updatedComment = this.prismaService.productComment.update({
			where: {
				id: commentId
			},
			data: {
				comment: dto.comment,
				rating: dto.rating
			},
			include: {
				account: true
			}
		})

		return plainToInstance(ProductCommentEntity, updatedComment)
	}

	public async deleteProductComment(commentId: string, accountId: string) {
		const comment = await this.prismaService.productComment.findFirst({
			where: {
				id: commentId
			}
		})

		if (!comment) {
			throw new BadRequestException('Комментарий не найден')
		}

		if (accountId !== comment.accountId) {
			throw new BadRequestException('Вы не можете удалить этот комментарий, так как он не принадлежит вам')
		}

		await this.prismaService.productComment.delete({
			where: {
				id: commentId
			}
		})

		return true
	}

	public async getProductCommentsByUserId(accountId: string) {
		const comments = await this.prismaService.productComment.findMany({
			where: {
				accountId
			},
			include: {
				product: true,
				replies: {
					include: {
						account: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return plainToInstance(ProductCommentEntity, comments)
	}

	public async getProductComments() {
		const comments = await this.prismaService.productComment.findMany({
			where: {
				parentId: null
			},
			include: {
				account: true,
				replies: {
					include: {
						account: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return plainToInstance(ProductCommentEntity, comments)
	}
}
