import type { AccountEntity } from '@/core/entities/account.entity'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Authorized = createParamDecorator((data: keyof AccountEntity, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()
	const account = request.account

	return data ? account[data] : account
})
