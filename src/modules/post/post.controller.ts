import { AccountEntity } from '@/core/entities/account.entity'
import { Authorization } from '@/shared/decorators/auth/auth.decorator'
import { Authorized } from '@/shared/decorators/auth/authorized.decorator'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { PostDto } from './dto/post.dto'
import { PostService } from './post.service'

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@HttpCode(201)
	@Authorization('EDITOR', 'SUPER_ADMIN', 'ADMIN')
	@Post('create')
	@UseInterceptors(FileInterceptor('image'))
	public async createPost(
		@Body() dto: PostDto,
		@UploadedFile() image: Express.Multer.File,
		@Authorized() account: AccountEntity
	) {
		return this.postService.createPost(dto, account, image)
	}

	@HttpCode(200)
	@Authorization('EDITOR', 'SUPER_ADMIN', 'ADMIN')
	@UseInterceptors(FileInterceptor('image'))
	@Patch('update')
	public async updatePost(
		@Query('postId') postId: string,
		@Body() dto: PostDto,
		@UploadedFile() image: Express.Multer.File,
		@Authorized() account: AccountEntity
	) {
		return await this.postService.updatePost(postId, dto, image, account)
	}

	@HttpCode(200)
	@Authorization('EDITOR', 'SUPER_ADMIN', 'ADMIN')
	@Delete('delete')
	public async deletePost(@Query('postId') postId: string, @Authorized() account: AccountEntity) {
		return await this.postService.deletePost(postId, account)
	}

	@HttpCode(201)
	@Authorization('EDITOR', 'SUPER_ADMIN', 'ADMIN')
	@Post('like')
	public async toogleLikePost(@Query('postId') postId: string, @Authorized() account: AccountEntity) {
		return this.postService.toogleLikePost(postId, account)
	}

	@HttpCode(200)
	@Get(':postId')
	public async getPostById(@Param('postId') postId: string) {
		return this.postService.getPostById(postId)
	}

	@HttpCode(200)
	@Get('/all')
	public async getPosts() {
		return this.postService.getPosts()
	}
}
