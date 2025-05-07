import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator'
import { LoyaltyTransactionType } from 'prisma/generated'

export class AddPointsDto {
	@IsNumber()
	points: number

	@IsString()
	type: LoyaltyTransactionType

	@IsString()
	@IsOptional()
	orderId?: string

	@IsString()
	@IsOptional()
	description?: string

	@IsObject()
	@IsOptional()
	metadata?: Record<string, any>
}
