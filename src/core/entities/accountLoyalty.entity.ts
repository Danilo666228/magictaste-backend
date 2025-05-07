import { Exclude, Type } from 'class-transformer'
import { AccountLoyalty } from 'prisma/generated'
import { JsonValue } from 'prisma/generated/runtime/library'
import { LoyaltyLevelEntity } from './loyaltyLevel.entity'

export class AccountLoyaltyEntity implements AccountLoyalty {
	id: string
	@Exclude()
	accountId: string
	achievements: JsonValue
	lastActivity: Date
	loyaltyLevelId: string
	@Type(() => LoyaltyLevelEntity)
	loyaltyLevel: LoyaltyLevelEntity
	ordersCount: number
	points: number
	totalSpent: number
	createdAt: Date
	updatedAt: Date
}
