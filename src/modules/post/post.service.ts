import { AccountEntity } from '@/core/entities/account.entity'
import { PostEntity } from '@/core/entities/post.entity'
import { PostCommentEntity } from '@/core/entities/postComment.entity'
import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { v4 as uuidv4 } from 'uuid'
import { StorageService } from '../libs/storage/storage.service'
import { NotificationsService } from '../notifications/notifications.service'
import { PostDto } from './dto/post.dto'
@Injectable()
export class PostService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly notificationsService: NotificationsService
	) {}
	public async getCommentById(commentId: string): Promise<PostCommentEntity> {
		const comment = await this.prismaService.postComment.findUnique({
			where: {
				id: commentId
			},
			include: {
				author: true,
				post: true
			}
		})

		return plainToInstance(PostCommentEntity, comment)
	}
	public async getPosts(): Promise<PostEntity[]> {
		const posts = await this.prismaService.post.findMany({
			include: { author: true, comments: true }
		})

		return plainToInstance(PostEntity, posts)
	}
	public async getPostById(postId: string): Promise<PostEntity> {
		const post = await this.prismaService.post.findUnique({
			where: { id: postId },
			include: { author: true, comments: true }
		})

		return plainToInstance(PostEntity, post)
	}

	public async createPost(dto: PostDto, account: AccountEntity, image: Express.Multer.File) {
		const postId = uuidv4()
		let imageUrl: string | null = null

		if (image) {
			imageUrl = await this.storageService.uploadImage({
				key: `/posts/${postId}/image`,
				buffer: image.buffer,
				contentType: image.mimetype
			})
		}

		return await this.prismaService.post.create({
			data: {
				id: postId,
				title: dto.title,
				description: dto.description,
				authorId: account.id,
				imageUrl
			}
		})
	}
	public async deletePost(postId: string, account: AccountEntity): Promise<boolean> {
		const post = await this.getPostById(postId)

		if (!post) {
			throw new NotFoundException('Пост не найден')
		}

		if (post.imageUrl) {
			await this.storageService.remove(post.imageUrl)
		}

		await this.prismaService.post.delete({
			where: {
				id: postId
			}
		})

		return true
	}
	public async updatePost(postId: string, dto: PostDto, image: Express.Multer.File, account: AccountEntity): Promise<boolean> {
		let imageUrl: string | null = null
		const post = await this.getPostById(postId)

		if (!post) {
			throw new NotFoundException('Пост не найден')
		}

		if (image) {
			if (post.imageUrl) {
				await this.storageService.remove(post.imageUrl)
			}
			imageUrl = await this.storageService.uploadImage({
				key: `/post/${postId}/image`,
				buffer: image.buffer,
				contentType: image.mimetype
			})
		}

		await this.prismaService.post.update({
			where: { id: postId },
			data: {
				title: dto.title,
				authorId: account.id,
				description: dto.description,
				published: dto.published,
				imageUrl
			}
		})

		return true
	}

	public async toogleLikePost(postId: string, account: AccountEntity): Promise<{ liked: boolean }> {
		const existingLike = await this.prismaService.postLike.findFirst({
			where: {
				accountId: account.id,
				postId
			}
		})

		if (existingLike) {
			await this.prismaService.postLike.delete({
				where: {
					id: existingLike.id
				}
			})
			return { liked: false }
		} else {
			await this.prismaService.postLike.create({
				data: {
					accountId: account.id,
					postId
				}
			})
			return { liked: true }
		}
	}
}
