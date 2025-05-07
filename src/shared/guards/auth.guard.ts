import { AccountService } from '@/modules/auth/account/account.service'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly accountService: AccountService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		if (typeof request.session.accountId === 'undefined') {
			throw new UnauthorizedException('Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.')
		}

		const account = await this.accountService.findAccountById(request.session.accountId)

		request.account = account
		// request.roles = account.roles.map(role => role.name)
		request.session.roles = account.roles.map(role => role.name)

		return true
	}
}
