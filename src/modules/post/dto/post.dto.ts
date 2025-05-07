import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class PostDto {
	@IsString()
	title: string

	@IsString()
	description: string

	@IsBoolean()
	@Transform(({ value }) => {
		if (value === 'true') return true
		if (value === 'false') return false
		return value
	})
	published: boolean
}
