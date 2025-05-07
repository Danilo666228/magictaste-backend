import { AccountEntity } from '@/core/entities/account.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { CommentDto } from './dto/comment.dto'
import { PostCommentService } from './post-comment.service'

@Controller('post-comment')
export class PostCommentController {
	constructor(private readonly postCommentService: PostCommentService) {}

	@HttpCode(200)
	@Get(':postId/comments')
	public async getCommentsByPost(@Param('postId') postId: string) {
		return this.postCommentService.getCommentsByPost(postId)
	}

	@HttpCode(201)
	@Authorization()
	@Post(':postId/comment/create')
	public async createComment(@Param('postId') postId: string, @Body() dto: CommentDto, @Authorized() account: AccountEntity) {
		return this.postCommentService.createComment(dto, account, postId)
	}

	@HttpCode(200)
	@Patch(':postId/comment/update')
	public async updateComment(@Param('postId') postId: string, @Body() dto: CommentDto, @Authorized() account: AccountEntity) {
		return this.postCommentService.updateComment(postId, dto, account)
	}

	@HttpCode(200)
	@Delete(':commentId/delete')
	public async deleteComment(@Param('commentId') commentId: string, @Authorized() account: AccountEntity) {
		return this.postCommentService.deleteComment(commentId, account)
	}
}
