import { getRecaptchaConfig } from '@/core/config/recaptcha.config'
import { MailService } from '@/shared/services/mail/mail.service'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { AccountService } from './account/account.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SessionService } from './session/session.service'
import { TotpModule } from './totp/totp.module'
import { TotpService } from './totp/totp.service'
import { TwoFactorService } from './two-factor/two-factor.service'
import { VerificationService } from './verification/verification.service'
import { ProfileModule } from './profile/profile.module'
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy } from './strategies/google.strategy'

@Module({
	imports: [
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		TotpModule,
		ProfileModule
		// forwardRef(() => VerificationModule)
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		TwoFactorService,
		SessionService,
		AccountService,
		TotpService,
		MailService,
		VerificationService,
		GoogleStrategy
	],
	exports: [AuthService]
})
export class AuthModule {}
