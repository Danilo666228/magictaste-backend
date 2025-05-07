import { Exclude } from 'class-transformer'
import { LoyaltyLevel } from 'prisma/generated'
import { JsonValue } from 'prisma/generated/runtime/library'

export class LoyaltyLevelEntity implements LoyaltyLevel {
	id: string
	additionalBenefits: JsonValue
	bonusPercentage: number
	createdAt: Date
	hasExclusiveAccess: boolean
	hasPersonalManager: boolean
	hasPriorityDelivery: boolean
	minPoints: number
	name: string
	updatedAt: Date
}
