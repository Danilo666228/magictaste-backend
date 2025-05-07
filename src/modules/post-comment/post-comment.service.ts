import { AccountEntity } from '@/core/entities/account.entity'
import { PostCommentEntity } from '@/core/entities/postComment.entity'
import { PrismaService } from '@/core/prisma/prisma.service'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PostComment } from 'prisma/generated/default'
import { PostService } from '../post/post.service'
import { CommentDto } from './dto/comment.dto'

@Injectable()
export class PostCommentService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly postService: PostService
	) {}

	public async getCommentById(commentId: string): Promise<PostCommentEntity> {
		const comment = await this.prismaService.postComment.findUnique({
			where: { id: commentId },
			include: { author: true, post: true }
		})

		return plainToInstance(PostCommentEntity, comment)
	}

	public async getCommentsByPost(postId: string): Promise<PostComment[]> {
		const post = await this.postService.getPostById(postId)

		if (!post) {
			throw new NotFoundException('Пост не найден')
		}

		return await this.prismaService.postComment.findMany({
			where: { id: postId },
			include: { author: true, post: true }
		})
	}
	public async createComment(dto: CommentDto, account: AccountEntity, postId: string): Promise<boolean> {
		await this.prismaService.postComment.create({
			data: {
				comment: dto.comment,
				authorId: account.id,
				postId
			}
		})

		return true
	}
	public async deleteComment(commentId: string, account: AccountEntity): Promise<boolean> {
		const comment = await this.getCommentById(commentId)

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		if (comment.authorId !== account.id) {
			throw new ForbiddenException('Вы не можете удалить этот комментарий')
		}

		await this.prismaService.postComment.delete({
			where: {
				id: commentId
			}
		})

		return true
	}
	public async updateComment(commentId: string, dto: CommentDto, account: AccountEntity): Promise<boolean> {
		const comment = await this.getCommentById(commentId)

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		if (comment.authorId !== account.id) {
			throw new ForbiddenException('Вы не можете обновить этот комментарий')
		}

		await this.prismaService.postComment.update({
			where: { id: commentId },
			data: { comment: dto.comment }
		})

		return true
	}
}
