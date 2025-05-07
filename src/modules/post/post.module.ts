import { Module } from '@nestjs/common'
import { AccountService } from '../auth/account/account.service'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
	controllers: [PostController],
	providers: [PostService, AccountService]
})
export class PostModule {}
