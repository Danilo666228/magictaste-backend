import { ROLES_KEY } from '@/shared/decorators/auth/roles.decorator'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { RoleName } from 'prisma/generated'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
		const request = context.switchToHttp().getRequest()

		if (!roles) return true

		if (!request.account.roles.some((role: { id: string; name: RoleName }) => roles.includes(role.name))) {
			throw new ForbiddenException('Недостаточно прав. У вас нет прав доступа к этому ресурсу.')
		}

		return true
	}
}
