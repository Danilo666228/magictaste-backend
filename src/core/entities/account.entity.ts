import { Transform, Type } from 'class-transformer'
import { Account } from 'prisma/generated'
import { AccountSettingsEntity } from './accountSettings.entity'
import { FavoriteEntity } from './favorite.entity'
import { RoleEntity } from './role.entity'
import { AccountLoyaltyEntity } from './accountLoyalty.entity'

export class AccountEntity implements Account {
	id: string
	email: string
	userName: string
	password: string
	picture: string
	createdAt: Date
	updatedAt: Date
	@Type(() => AccountSettingsEntity)
	accountSettings: AccountSettingsEntity
	@Transform(({ value }) => value.map(({ role }) => role))
	roles: RoleEntity[]
	@Type(() => FavoriteEntity)
	favorites: FavoriteEntity[]
	@Type(() => AccountLoyaltyEntity)
	accountLoyalty: AccountLoyaltyEntity
}
