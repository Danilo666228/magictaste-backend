import { IsNotEmpty, IsString } from 'class-validator'

export class ReturnOrderDto {
	@IsString()
	@IsNotEmpty()
	reason: string
}
