import { MailService } from '@/shared/services/mail/mail.service'
import { Module } from '@nestjs/common'
import { TwoFactorService } from '../two-factor/two-factor.service'

import { SessionService } from '../session/session.service'
import { VerificationService } from '../verification/verification.service'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

@Module({
	controllers: [AccountController],
	providers: [AccountService, TwoFactorService, VerificationService, SessionService, MailService],
	exports: [AccountService]
})
export class AccountModule {}
