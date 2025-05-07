import { Module } from '@nestjs/common'

import { MailService } from '../../../shared/services/mail/mail.service'
import { AccountService } from '../account/account.service'
import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, AccountService, MailService]
})
export class PasswordRecoveryModule {}
