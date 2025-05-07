import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { PostService } from '../post/post.service'
import { PostCommentController } from './post-comment.controller'
import { PostCommentService } from './post-comment.service'

@Module({
	controllers: [PostCommentController],
	providers: [PostCommentService, PostService, AccountService]
})
export class PostCommentModule {}
