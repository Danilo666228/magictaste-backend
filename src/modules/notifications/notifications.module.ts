import { Global, Module } from '@nestjs/common'
import { NotificationsGateway } from './notifications.gateway'

import { AccountModule } from '../auth/account/account.module'
import { AccountService } from '../auth/account/account.service'
import { NotificationsService } from './notifications.service'
@Global()
@Module({
	imports: [AccountModule],
	providers: [NotificationsGateway, NotificationsService, AccountService],
	exports: [NotificationsService]
})
export class NotificationsModule {}
