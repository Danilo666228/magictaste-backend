import { IsNotEmpty, IsString, Length } from 'class-validator'

export class EnableTotpDto {
	@IsNotEmpty()
	@IsString()
	secret: string

	@IsNotEmpty()
	@IsString()
	@Length(6)
	pin: string
}
