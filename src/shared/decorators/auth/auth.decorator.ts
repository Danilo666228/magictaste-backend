import { applyDecorators, UseGuards } from '@nestjs/common'
import { RoleName } from 'prisma/generated'
import { Roles } from './roles.decorator'
import { AuthGuard } from '@/shared/guards/auth.guard'
import { RolesGuard } from '@/shared/guards/roles.guard'

export function Authorization(...roles: RoleName[]) {
	if (roles.length > 0) {
		return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard))
	}
	return applyDecorators(UseGuards(AuthGuard))
}
