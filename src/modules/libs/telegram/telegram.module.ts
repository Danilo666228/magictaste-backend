import { getTelegrafConfig } from '@/core/config/telegraf.config'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'
import { TelegramService } from './telegram.service'

@Global()
@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTelegrafConfig,
			inject: [ConfigService]
		})
	],
	providers: [TelegramService],
	exports: [TelegramService]
})
export class TelegramModule {}
