import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { CoreModule } from './core/core.module'
import { RedisService } from './core/redis/redis.service'
import { ms, StringValue } from './shared/common/ms'
import { parseBoolean } from './shared/common/parse-boolean'
async function bootstrap() {
	const app = await NestFactory.create(CoreModule)

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)
	app.setGlobalPrefix('api')

	const configSwagger = new DocumentBuilder().setTitle('API').setDescription('API для приложения').setVersion('1.0').build()

	const document = SwaggerModule.createDocument(app, configSwagger)
	SwaggerModule.setup('api/docs', app, document)

	app.use(
		'/scalar',
		apiReference({
			content: document
		})
	)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')))

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				sameSite: config.getOrThrow<string>('SAMESITE') as 'lax' | 'none' | 'strict'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	const wsAdapter = new IoAdapter(app)

	app.useWebSocketAdapter(wsAdapter)

	await app.listen(config.get<string>('API_PORT'))
}
bootstrap()
