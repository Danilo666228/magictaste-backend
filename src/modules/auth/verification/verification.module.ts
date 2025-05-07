import { MailModule } from '@/shared/services/mail/mail.module'
import { MailService } from '@/shared/services/mail/mail.service'
import { forwardRef, Module } from '@nestjs/common'

import { AccountService } from '../account/account.service'
import { AuthModule } from '../auth.module'
import { SessionService } from '../session/session.service'
import { TwoFactorService } from '../two-factor/two-factor.service'
import { VerificationController } from './verification.controller'
import { VerificationService } from './verification.service'

@Module({
	imports: [MailModule, forwardRef(() => AuthModule)],
	controllers: [VerificationController],
	providers: [VerificationService, MailService, AccountService, TwoFactorService, SessionService],
	exports: [VerificationService]
})
export class VerificationModule {}
