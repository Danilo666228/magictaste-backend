import { Type } from 'class-transformer'
import { PostComment } from 'prisma/generated'
import { AccountEntity } from './account.entity'
import { PostEntity } from './post.entity'

export class PostCommentEntity implements PostComment {
	id: string
	authorId: string
	postId: string
	comment: string
	createdAt: Date
	updatedAt: Date
	@Type(() => PostCommentEntity)
	comments: PostCommentEntity[]
	@Type(() => AccountEntity)
	author: AccountEntity
	@Type(() => PostEntity)
	post: PostEntity
}
