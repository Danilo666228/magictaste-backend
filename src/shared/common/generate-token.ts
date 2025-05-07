import { AccountEntity } from '@/core/entities/account.entity'
import { PrismaService } from '@/core/prisma/prisma.service'
import { Account, TokenTypes } from 'prisma/generated'
import { v4 as uuidv4 } from 'uuid'

export async function generateToken(prismaService: PrismaService, account: Account, type: TokenTypes, isUUID: boolean = true) {
	let token: string

	if (isUUID) {
		token = uuidv4()
	} else {
		token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString()
	}

	const expiresIn = new Date(new Date().getTime() + 300000)

	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			account: {
				id: account.id
			}
		}
	})

	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id,
				type
			}
		})
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			account: {
				connect: {
					id: account.id
				}
			}
		},
		include: {
			account: {
				include: {
					accountSettings: true
				}
			}
		}
	})

	return newToken
}
