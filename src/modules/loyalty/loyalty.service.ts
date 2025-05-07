import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../core/prisma/prisma.service'
import { CreateLoyaltyLevelDto } from './dto/create-loyalty-level.dto'
import { AddPointsDto } from './dto/add-points.dto'
import { AccountLoyalty, LoyaltyLevel, LoyaltyTransaction } from 'prisma/generated'
import { plainToInstance } from 'class-transformer'
import { AccountLoyaltyEntity } from '@/core/entities/accountLoyalty.entity'
import { LoyaltyLevelEntity } from '@/core/entities/loyaltyLevel.entity'

@Injectable()
export class LoyaltyService {
	constructor(private readonly prismaService: PrismaService) {}

	public async createLoyaltyLevel(data: CreateLoyaltyLevelDto): Promise<LoyaltyLevel> {
		return await this.prismaService.loyaltyLevel.create({ data })
	}

	public async getAccountLoyalty(accountId: string): Promise<AccountLoyaltyEntity> {
		const loyalty = await this.prismaService.accountLoyalty.findUnique({
			where: { accountId },
			include: {
				loyaltyLevel: true,
				transactions: {
					orderBy: { createdAt: 'desc' },
					take: 10
				}
			}
		})
		if (!loyalty) {
			throw new NotFoundException('Loyalty not found')
		}

		const nextLevel = await this.prismaService.loyaltyLevel.findFirst({
			where: {
				minPoints: {
					gt: loyalty.points
				}
			},
			orderBy: {
				minPoints: 'asc'
			}
		})

		const pointsToNextLevel = nextLevel ? nextLevel.minPoints - loyalty.points : 0

		const loyaltyWithNextLevel = {
			...loyalty,
			pointsToNextLevel
		}

		return plainToInstance(AccountLoyaltyEntity, loyaltyWithNextLevel)
	}

	public async addPoints(accountId: string, data: AddPointsDto): Promise<LoyaltyTransaction> {
		const accountLoyalty = await this.prismaService.accountLoyalty.findUnique({
			where: { accountId }
		})

		if (!accountLoyalty) {
			throw new Error('Account loyalty not found')
		}

		const transaction = await this.prismaService.loyaltyTransaction.create({
			data: {
				accountLoyaltyId: accountLoyalty.id,
				points: data.points,
				type: data.type,
				orderId: data.orderId,
				description: data.description,
				metadata: data.metadata
			}
		})

		await this.prismaService.accountLoyalty.update({
			where: { id: accountLoyalty.id },
			data: {
				points: accountLoyalty.points + data.points,
				lastActivity: new Date()
			}
		})

		await this.checkAndUpdateLoyaltyLevel(accountId)

		return transaction
	}

	public async getNextLevelLoyaltyAccount(accountId: string): Promise<LoyaltyLevelEntity> {
		const currentLoyaltyLevel = await this.prismaService.accountLoyalty.findFirst({
			where: { accountId }
		})

		if (!currentLoyaltyLevel) {
			throw new BadRequestException('У вас нету программы лояльности')
		}

		const nextLevelLoyalty = await this.prismaService.loyaltyLevel.findFirst({
			where: {
				minPoints: {
					gt: currentLoyaltyLevel.points
				}
			},
			orderBy: {
				minPoints: 'asc'
			}
		})

		if (!nextLevelLoyalty) {
			throw new BadRequestException('У вас максимальный уровень лояльности')
		}

		return plainToInstance(LoyaltyLevelEntity, nextLevelLoyalty)
	}

	private async checkAndUpdateLoyaltyLevel(accountId: string): Promise<void> {
		const accountLoyalty = await this.prismaService.accountLoyalty.findUnique({
			where: { accountId },
			include: { loyaltyLevel: true }
		})

		if (!accountLoyalty) return

		const currentLevel = accountLoyalty.loyaltyLevel
		const nextLevel = await this.prismaService.loyaltyLevel.findFirst({
			where: {
				minPoints: {
					gt: currentLevel.minPoints
				}
			},
			orderBy: {
				minPoints: 'asc'
			}
		})

		if (nextLevel && accountLoyalty.points >= nextLevel.minPoints) {
			await this.prismaService.accountLoyalty.update({
				where: { id: accountLoyalty.id },
				data: {
					loyaltyLevelId: nextLevel.id
				}
			})
		}
	}

	public async getLoyaltyLevels(): Promise<LoyaltyLevel[]> {
		return this.prismaService.loyaltyLevel.findMany({
			orderBy: {
				minPoints: 'asc'
			}
		})
	}

	async getLoyaltyTransactions(accountId: string, page: number = 1, limit: number = 10): Promise<LoyaltyTransaction[]> {
		const accountLoyalty = await this.prismaService.accountLoyalty.findUnique({
			where: { accountId }
		})

		if (!accountLoyalty) {
			throw new Error('Account loyalty not found')
		}

		return this.prismaService.loyaltyTransaction.findMany({
			where: { accountLoyaltyId: accountLoyalty.id },
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit
		})
	}

	public async initializeAccountLoyalty(accountId: string): Promise<AccountLoyalty> {
		const lowestLevel = await this.prismaService.loyaltyLevel.findFirst({
			orderBy: {
				minPoints: 'asc'
			}
		})

		if (!lowestLevel) {
			throw new Error('No loyalty levels found')
		}

		return await this.prismaService.accountLoyalty.create({
			data: {
				accountId,
				loyaltyLevelId: lowestLevel.id,
				points: 0,
				totalSpent: 0,
				ordersCount: 0,
				lastActivity: new Date(),
				achievements: {}
			}
		})
	}
}
