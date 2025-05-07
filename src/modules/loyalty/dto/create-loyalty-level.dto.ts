import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class BenefitDto {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsBoolean()
	@IsOptional()
	isActive?: boolean
}

export class CreateLoyaltyLevelDto {
	@IsString()
	name: string

	@IsNumber()
	minPoints: number

	@IsNumber()
	bonusPercentage: number

	@IsBoolean()
	@IsOptional()
	hasPriorityDelivery?: boolean

	@IsBoolean()
	@IsOptional()
	hasPersonalManager?: boolean

	@IsBoolean()
	@IsOptional()
	hasExclusiveAccess?: boolean

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BenefitDto)
	@IsOptional()
	benefits?: BenefitDto[]
}
