import { Role, RoleName } from 'prisma/generated'

export class RoleEntity implements Role {
	id: string
	name: RoleName
}
