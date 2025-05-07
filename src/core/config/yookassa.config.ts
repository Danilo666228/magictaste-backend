import { ConfigService } from '@nestjs/config'
import { YookassaOptions } from 'nestjs-yookassa'

export function getYookassaConfig(configService: ConfigService): YookassaOptions {
	return {
		shopId: configService.getOrThrow('YOOKASSA_SHOP_ID'),
		apiKey: configService.getOrThrow('YOOKASSA_SECRET_KEY')
	}
}
