import { PrismaModule } from '@/core/prisma/prisma.module'
import { RedisModule } from '@/core/redis/redis.module'
import { AccountModule } from '@/modules/auth/account/account.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { PasswordRecoveryModule } from '@/modules/auth/password-recovery/password-recovery.module'
import { SessionModule } from '@/modules/auth/session/session.module'
import { TotpModule } from '@/modules/auth/totp/totp.module'
import { TwoFactorModule } from '@/modules/auth/two-factor/two-factor.module'
import { VerificationModule } from '@/modules/auth/verification/verification.module'
import { CartModule } from '@/modules/cart/cart.module'
import { CategoryModule } from '@/modules/category/category.module'
import { CronModule } from '@/modules/cron/cron.module'
import { DeliveryAddressModule } from '@/modules/delivery-address/delivery-address.module'
import { FavoriteModule } from '@/modules/favorite/favorite.module'
import { IngredientModule } from '@/modules/ingredient/ingredient.module'
import { StorageModule } from '@/modules/libs/storage/storage.module'
import { NotificationsModule } from '@/modules/notifications/notifications.module'
import { OrderModule } from '@/modules/order/order.module'
import { PostCommentModule } from '@/modules/post-comment/post-comment.module'
import { PostModule } from '@/modules/post/post.module'
import { ProductCommentModule } from '@/modules/product-comment/product-comment.module'
import { ProductModule } from '@/modules/product/product.module'
import { StatisticsModule } from '@/modules/statistics/statistics.module'
import { SupportChatModule } from '@/modules/support-chat/support-chat.module'
import { MailModule } from '@/shared/services/mail/mail.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ProfileModule } from '@/modules/auth/profile/profile.module'
import { LoyaltyModule } from '@/modules/loyalty/loyalty.module'
import { TelegramModule } from '@/modules/libs/telegram/telegram.module'
import { PaymentModule } from '@/modules/libs/payment/payment.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ScheduleModule.forRoot(),
		CronModule,
		AuthModule,
		AccountModule,
		PrismaModule,
		MailModule,
		PasswordRecoveryModule,
		TwoFactorModule,
		CartModule,
		FavoriteModule,
		CategoryModule,
		IngredientModule,
		ProductModule,
		OrderModule,
		ProductCommentModule,
		VerificationModule,
		RedisModule,
		SessionModule,
		DeliveryAddressModule,
		StorageModule,
		SupportChatModule,
		TotpModule,
		NotificationsModule,
		StatisticsModule,
		PostModule,
		PostCommentModule,
		ProfileModule,
		LoyaltyModule,
		TelegramModule,
		PaymentModule
	]
	// providers: [
	// 	{
	// 		provide: APP_INTERCEPTOR,
	// 		useClass: TemporaryIdInterceptor
	// 	}
	// ]
})
export class CoreModule {}
