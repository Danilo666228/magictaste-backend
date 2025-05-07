import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class DecreaseCartDto {
	@IsNotEmpty()
	@IsString()
	productId: string

	@IsOptional()
	@IsNumber()
	@Min(1)
	quantity: number = 1
}
