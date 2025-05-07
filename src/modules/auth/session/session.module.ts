import { Module } from '@nestjs/common'
import { AccountService } from '../account/account.service'
import { SessionController } from './session.controller'
import { SessionService } from './session.service'

@Module({
	controllers: [SessionController],
	providers: [SessionService, AccountService]
})
export class SessionModule {}
