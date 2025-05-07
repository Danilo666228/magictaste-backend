import { Module } from '@nestjs/common'
import { MailService } from '../../../shared/services/mail/mail.service'
import { TwoFactorService } from './two-factor.service'
import { AccountService } from '../account/account.service'

@Module({
	providers: [TwoFactorService, MailService, AccountService]
})
export class TwoFactorModule {}
