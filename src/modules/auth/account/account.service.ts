import { AccountEntity } from '@/core/entities/account.entity'
import { PrismaService } from '@/core/prisma/prisma.service'

import { StorageService } from '@/modules/libs/storage/storage.service'
import { NotificationsService } from '@/modules/notifications/notifications.service'

import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { Prisma } from 'prisma/generated'

import { LoyaltyService } from '@/modules/loyalty/loyalty.service'
import { CreateAccountDto } from './dto/createAccount.dto'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly notificationsService: NotificationsService,
		private readonly loyaltyService: LoyaltyService
	) {}

	public readonly INCLUDE_QUERY: Prisma.AccountInclude = {
		roles: {
			include: {
				role: true
			}
		},
		cart: true,
		deliveryAdresses: true,
		favorites: {
			include: {
				product: true
			}
		},
		orders: true,
		productComments: true,
		notifications: true,
		receivedMessages: true,
		sentMessages: true,
		tokens: true,
		accountSettings: true,
		accountLoyalty: {
			include: {
				loyaltyLevel: true
			}
		}
	}

	public async findAccountById(accountId: string): Promise<AccountEntity> {
		const account = await this.prismaService.account.findUnique({
			where: { id: accountId },
			include: this.INCLUDE_QUERY
		})

		return plainToInstance(AccountEntity, account)
	}

	public async getAccounts(page?: number, limit?: number) {
		const accounts = await this.prismaService.account.findMany({
			include: this.INCLUDE_QUERY,
			orderBy: {
				roles: {
					_count: 'desc'
				}
			},
			...(page && limit
				? {
						skip: (page - 1) * limit,
						take: limit
					}
				: {})
		})

		return plainToInstance(AccountEntity, accounts)
	}

	public async createAccount(dto: CreateAccountDto) {
		const existAccount = await this.prismaService.account.findUnique({ where: { email: dto.email } })
		const existAccountByUserName = await this.prismaService.account.findUnique({ where: { userName: dto.userName } })

		if (existAccountByUserName) {
			throw new ConflictException('Пользователь с таким логином уже существует')
		}

		if (existAccount) {
			throw new ConflictException('Пользователь с таким email уже существует')
		}

		const hashedPassword = await hash(dto.password)

		const account = await this.prismaService.account.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				userName: dto.userName,
				accountSettings: {
					create: {
						siteNotification: true,
						telegramNotification: false,
						isTwoFactorEmailEnabled: false,
						isVerifiedEmail: false,
						isTwoFactorTotpEnabled: false
					}
				},
				roles: {
					create: {
						role: {
							connect: {
								name: 'REGULAR'
							}
						}
					}
				}
			},
			include: this.INCLUDE_QUERY
		})

		await this.loyaltyService.initializeAccountLoyalty(account.id)

		return plainToInstance(AccountEntity, account)
	}
}
