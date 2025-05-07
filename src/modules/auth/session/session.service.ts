import { RedisService } from '@/core/redis/redis.service'
import { NotificationsService } from '@/modules/notifications/notifications.service'
import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { SessionData } from 'express-session'
import { Account } from 'prisma/generated'

@Injectable()
export class SessionService {
	private readonly sessionName: string
	private readonly sessionDomain: string
	private readonly sessionFolder: string
	private readonly sessionSecure: boolean
	private readonly sessionHttpOnly: boolean
	private readonly sessionSameSite: 'lax' | 'strict' | 'none'
	private readonly cookieOptions: {
		domain: string
		path: string
		secure: boolean
		httpOnly: boolean
		sameSite: 'lax' | 'strict' | 'none'
	}

	public constructor(
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly notificationsService: NotificationsService
	) {
		this.sessionName = this.configService.getOrThrow<string>('SESSION_NAME')
		this.sessionDomain = this.configService.getOrThrow<string>('SESSION_DOMAIN')
		this.sessionFolder = this.configService.getOrThrow<string>('SESSION_FOLDER')
		this.sessionSecure = this.configService.getOrThrow<boolean>('SESSION_SECURE')
		this.sessionHttpOnly = this.configService.getOrThrow<boolean>('SESSION_HTTP_ONLY')
		this.sessionSameSite = this.configService.getOrThrow<string>('SAMESITE') as 'lax' | 'strict' | 'none'
		this.cookieOptions = {
			domain: this.sessionDomain,
			path: '/',
			secure: this.sessionSecure,
			httpOnly: this.sessionHttpOnly,
			sameSite: this.sessionSameSite
		}
	}

	public async findByUser(request: Request) {
		const accountId = request.session.accountId

		if (!accountId) {
			throw new NotFoundException('Пользователь не обнаружен в сессии')
		}

		const sessionPattern = `${this.sessionFolder}*`
		const keys = await this.redisService.keys(sessionPattern)
		const sessions = await this.getSessionsData(keys, accountId)

		return this.filterAndSortSessions(sessions, request.session.id)
	}

	private async getSessionsData(keys: string[], accountId: string) {
		const sessions: SessionData[] = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)
			if (!sessionData) continue

			const session = JSON.parse(sessionData)
			if (session.accountId === accountId) {
				sessions.push({ ...session, id: key.split(':')[1] })
			}
		}

		return sessions
	}

	private filterAndSortSessions(sessions: SessionData[], currentSessionId: string) {
		return sessions
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

			.filter(session => session.id !== currentSessionId)
	}

	public async findCurrentSession(request: Request) {
		const sessionId = request.session.id
		const sessionKey = `${this.sessionFolder}${sessionId}`
		const sessionData = await this.redisService.get(sessionKey)

		return {
			session: JSON.parse(sessionData),
			id: sessionId
		}
	}

	public async clearSession(request: Request) {
		request.res.clearCookie(this.sessionName, this.cookieOptions)
		return true
	}

	public async saveSession(request: Request, account: Account, metadata?: SessionMetadata) {
		return new Promise((resolve, reject) => {
			request.session.createdAt = new Date()
			request.session.accountId = account.id
			request.session.metadata = metadata

			request.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.')
					)
				}
				resolve({ account })
			})
		})
	}

	public async destroySession(request: Request) {
		return new Promise((resolve, reject) => {
			request.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Не удалось завершить сессию. Проверьте, правильно ли настроены параметры сессии.')
					)
				}
				resolve(true)
			})
		})
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException('Текущую сессию удалить нельзя')
		}

		const sessionKey = `${this.sessionFolder}${id}`
		await this.redisService.del(sessionKey)
		await this.notificationsService.create({
			accountId: req.session.accountId,
			title: 'Удаление сессии',
			message: 'Сессия успешно завершена',
			type: 'success'
		})
		return true
	}

	// public async getLastSuccessfulSession(accountId: string) {
	// 	const sessionPattern = `${this.sessionFolder}*`
	// 	const keys = await this.redisService.keys(sessionPattern)
	// 	const sessions = await this.getSessionsData(keys, accountId)

	// 	return sessions
	// 		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	// 		.find(session => session.accountId === accountId && session.metadata?.ip)
	// }
}
