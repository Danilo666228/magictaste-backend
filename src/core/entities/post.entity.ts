import { Post } from 'prisma/generated'

export class PostEntity implements Post {
	id: string
	title: string
	description: string
	imageUrl: string
	published: boolean
	authorId: string
	createdAt: Date
	updatedAt: Date
}
