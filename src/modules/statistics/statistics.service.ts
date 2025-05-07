import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService) {}

	public async getSalesStatiscticsV2(period?: string) {
		const startDate = this.getDateRangeByPeriod(period)
		const endDate = new Date()

		// Получаем продажи за период с группировкой по дате
		const sales = await this.prisma.order.groupBy({
			by: ['createdAt'],
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate
				},
				status: {
					in: ['COMPLETED', 'DELIVERING', 'READY_FOR_DELIVERY']
				}
			},
			_sum: {
				total: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		// Создаем массив дат за весь период
		const dates = []
		const currentDate = new Date(startDate)
		while (currentDate <= endDate) {
			dates.push(new Date(currentDate))
			currentDate.setDate(currentDate.getDate() + 1)
		}

		// Создаем мапу продаж по датам (оптимизированная версия)
		const salesMap = new Map()
		sales.forEach(sale => {
			const dateKey = sale.createdAt.toISOString().split('T')[0]
			salesMap.set(dateKey, sale._sum.total || 0)
		})

		// Формируем результат с учетом всех дат (оптимизированная версия)
		return dates.map(date => {
			const dateKey = date.toISOString().split('T')[0]
			return {
				date: date,
				sale: salesMap.get(dateKey) || 0
			}
		})
	}

	public async getSalesStatistics(period?: string) {
		// Определение временного диапазона для текущего периода
		const currentPeriodStart = this.getDateRangeByPeriod(period)

		// Получение общей статистики продаж за текущий период
		const totalSales = await this.prisma.order.count({
			where: {
				createdAt: currentPeriodStart ? { gte: currentPeriodStart } : undefined,
				status: 'COMPLETED'
			}
		})

		// Получение общей суммы продаж за текущий период
		const salesData = await this.prisma.order.aggregate({
			where: {
				createdAt: currentPeriodStart ? { gte: currentPeriodStart } : undefined,
				status: 'COMPLETED'
			},
			_sum: {
				total: true
			}
		})

		// Рассчитываем даты для предыдущего периода
		let previousPeriodStart = null
		let previousPeriodEnd = null

		if (currentPeriodStart) {
			// Если указан период, вычисляем предыдущий аналогичный период
			const now = new Date()
			const periodDuration = now.getTime() - currentPeriodStart.getTime()

			previousPeriodEnd = new Date(currentPeriodStart)
			previousPeriodStart = new Date(currentPeriodStart.getTime() - periodDuration)
		} else {
			// Если период не указан (all-time), используем предыдущий год
			const oneYearAgo = new Date()
			oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
			previousPeriodStart = oneYearAgo
		}

		// Получаем статистику за предыдущий период
		const previousSalesCount = await this.prisma.order.count({
			where: {
				createdAt: {
					gte: previousPeriodStart,
					...(previousPeriodEnd && { lt: previousPeriodEnd })
				},
				status: 'COMPLETED'
			}
		})

		const previousSalesData = await this.prisma.order.aggregate({
			where: {
				createdAt: {
					gte: previousPeriodStart,
					...(previousPeriodEnd && { lt: previousPeriodEnd })
				},
				status: 'COMPLETED'
			},
			_sum: {
				total: true
			}
		})

		// Рассчитываем проценты изменения
		const currentAmount = salesData._sum.total || 0
		const previousAmount = previousSalesData._sum.total || 0

		let salesPercentChange = 0
		if (previousSalesCount > 0) {
			salesPercentChange = ((totalSales - previousSalesCount) / previousSalesCount) * 100
		} else if (totalSales > 0) {
			salesPercentChange = 100
		}

		let amountPercentChange = 0
		if (previousAmount > 0) {
			amountPercentChange = ((currentAmount - previousAmount) / previousAmount) * 100
		} else if (currentAmount > 0) {
			amountPercentChange = 100
		}

		return {
			totalSales,
			salesAmount: currentAmount,
			period: period || 'all-time',
			comparison: {
				previousSales: previousSalesCount,
				previousAmount: previousAmount,
				salesPercentChange: Math.round(salesPercentChange * 100) / 100,
				amountPercentChange: Math.round(amountPercentChange * 100) / 100,
				salesTrend: salesPercentChange >= 0 ? 'up' : 'down',
				amountTrend: amountPercentChange >= 0 ? 'up' : 'down'
			}
		}
	}

	async getTopSellingProducts(limit = 10, period?: string) {
		const dateFrom = this.getDateRangeByPeriod(period)

		// Получение самых продаваемых товаров через OrderItem
		const topProducts = await this.prisma.orderItem.groupBy({
			by: ['productId'],
			where: {
				order: {
					createdAt: dateFrom ? { gte: dateFrom } : undefined,
					status: 'COMPLETED'
				}
			},
			_sum: {
				quantity: true,
				price: true
			},
			orderBy: {
				_sum: {
					quantity: 'desc'
				}
			},
			take: limit
		})

		// Получение дополнительной информации о продуктах
		const productsWithDetails = await Promise.all(
			topProducts.map(async item => {
				const product = await this.prisma.product.findUnique({
					where: { id: item.productId },
					select: { id: true, title: true, price: true, imageUrl: true }
				})

				return {
					id: product.id,
					title: product.title,
					imageUrl: product.imageUrl,
					totalQuantity: item._sum.quantity,
					totalRevenue: item._sum.price
				}
			})
		)

		return productsWithDetails
	}

	async getCustomerStatistics(period?: string) {
		// Определение временного диапазона для текущего периода
		const currentPeriodStart = this.getDateRangeByPeriod(period)

		// Общее количество клиентов на текущий момент
		const totalCustomers = await this.prisma.account.count()

		// Новые клиенты за текущий период
		const newCustomers = await this.prisma.account.count({
			where: {
				createdAt: currentPeriodStart ? { gte: currentPeriodStart } : undefined
			}
		})

		// Активные клиенты (сделавшие заказ за текущий период)
		const activeCustomers = await this.prisma.order.groupBy({
			by: ['accountId'],
			where: {
				createdAt: currentPeriodStart ? { gte: currentPeriodStart } : undefined,
				accountId: { not: null }
			},
			_count: {
				accountId: true
			}
		})

		// Рассчитываем даты для предыдущего периода
		let previousPeriodStart = null
		let previousPeriodEnd = null

		if (currentPeriodStart) {
			// Если указан период, вычисляем предыдущий аналогичный период
			const now = new Date()
			const periodDuration = now.getTime() - currentPeriodStart.getTime()

			previousPeriodEnd = new Date(currentPeriodStart)
			previousPeriodStart = new Date(currentPeriodStart.getTime() - periodDuration)
		} else {
			// Если период не указан (all-time), используем предыдущий год
			const oneYearAgo = new Date()
			oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
			previousPeriodStart = oneYearAgo
		}

		// Получаем количество новых клиентов за предыдущий период
		const previousNewCustomers = await this.prisma.account.count({
			where: {
				createdAt: {
					gte: previousPeriodStart,
					...(previousPeriodEnd && { lt: previousPeriodEnd })
				}
			}
		})

		// Получаем количество активных клиентов за предыдущий период
		const previousActiveCustomers = await this.prisma.order.groupBy({
			by: ['accountId'],
			where: {
				createdAt: {
					gte: previousPeriodStart,
					...(previousPeriodEnd && { lt: previousPeriodEnd })
				},
				accountId: { not: null }
			},
			_count: {
				accountId: true
			}
		})

		// Рассчитываем проценты изменения
		const currentActiveCount = activeCustomers.length
		const previousActiveCount = previousActiveCustomers.length

		let newCustomersPercentChange = 0
		if (previousNewCustomers > 0) {
			newCustomersPercentChange = ((newCustomers - previousNewCustomers) / previousNewCustomers) * 100
		} else if (newCustomers > 0) {
			newCustomersPercentChange = 100
		}

		let activeCustomersPercentChange = 0
		if (previousActiveCount > 0) {
			activeCustomersPercentChange = ((currentActiveCount - previousActiveCount) / previousActiveCount) * 100
		} else if (currentActiveCount > 0) {
			activeCustomersPercentChange = 100
		}

		return {
			totalCustomers,
			newCustomers,
			activeCustomers: currentActiveCount,
			period: period || 'all-time',
			comparison: {
				previousNewCustomers,
				previousActiveCustomers: previousActiveCount,
				newCustomersPercentChange: Math.round(newCustomersPercentChange * 100) / 100,
				activeCustomersPercentChange: Math.round(activeCustomersPercentChange * 100) / 100,
				newCustomersTrend: newCustomersPercentChange >= 0 ? 'up' : 'down',
				activeCustomersTrend: activeCustomersPercentChange >= 0 ? 'up' : 'down'
			}
		}
	}

	async getOrderStatusStatistics() {
		// Статистика по статусам заказов
		const orderStatusStats = await this.prisma.order.groupBy({
			by: ['status'],
			_count: {
				id: true
			}
		})

		// Преобразуем в более удобный формат
		const formattedStats = orderStatusStats.reduce((acc, stat) => {
			acc[stat.status] = stat._count.id
			return acc
		}, {})

		return formattedStats
	}

	async getPaymentMethodStatistics() {
		// Статистика по методам оплаты
		const paymentMethodStats = await this.prisma.order.groupBy({
			by: ['paymentMethod'],
			_count: {
				id: true
			},
			_sum: {
				total: true
			}
		})

		return paymentMethodStats.map(stat => ({
			method: stat.paymentMethod,
			count: stat._count.id,
			total: stat._sum.total
		}))
	}

	async getCategoryPerformance() {
		// Статистика продаж по категориям
		const categoryStats = await this.prisma.product.groupBy({
			by: ['categoryId'],
			_count: {
				id: true
			}
		})

		const categoriesWithDetails = await Promise.all(
			categoryStats.map(async stat => {
				const category = await this.prisma.category.findUnique({
					where: { id: stat.categoryId },
					select: { id: true, title: true }
				})

				// Получаем сумму продаж для этой категории
				const salesData = await this.prisma.orderItem.aggregate({
					where: {
						product: {
							categoryId: stat.categoryId
						},
						order: {
							status: 'COMPLETED'
						}
					},
					_sum: {
						price: true
					}
				})

				return {
					categoryId: category.id,
					categoryTitle: category.title,
					productCount: stat._count.id,
					totalSales: salesData._sum.price || 0
				}
			})
		)

		return categoriesWithDetails
	}

	async getUserPurchaseStatistics(userId: string) {
		// Проверяем существование пользователя
		const user = await this.prisma.account.findUnique({
			where: { id: userId },
			select: { id: true, email: true, userName: true }
		})

		if (!user) {
			throw new NotFoundException(`Пользователь с ID ${userId} не найден`)
		}

		// Получаем общую статистику заказов пользователя
		const orderStats = await this.prisma.order.aggregate({
			where: {
				accountId: userId
			},
			_count: {
				id: true // Общее количество заказов
			},
			_sum: {
				total: true // Общая сумма всех заказов
			},
			_avg: {
				total: true // Средняя сумма заказа
			},
			_max: {
				total: true // Максимальная сумма заказа
			}
		})

		// Получаем статистику по статусам заказов
		const orderStatusStats = await this.prisma.order.groupBy({
			by: ['status'],
			where: {
				accountId: userId
			},
			_count: {
				id: true
			}
		})

		// Получаем последние 5 заказов пользователя
		const recentOrders = await this.prisma.order.findMany({
			where: {
				accountId: userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 5,
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								title: true,
								imageUrl: true
							}
						}
					}
				}
			}
		})

		// Получаем наиболее часто покупаемые товары
		const frequentlyPurchasedProducts = await this.prisma.orderItem.groupBy({
			by: ['productId'],
			where: {
				order: {
					accountId: userId
				}
			},
			_sum: {
				quantity: true
			},
			orderBy: {
				_sum: {
					quantity: 'desc'
				}
			},
			take: 5
		})

		// Получаем детали часто покупаемых товаров
		const topProducts = await Promise.all(
			frequentlyPurchasedProducts.map(async item => {
				const product = await this.prisma.product.findUnique({
					where: { id: item.productId },
					select: { id: true, title: true, price: true, imageUrl: true }
				})

				return {
					id: product.id,
					title: product.title,
					imageUrl: product.imageUrl,
					totalQuantity: item._sum.quantity
				}
			})
		)

		// Формируем итоговую статистику
		return {
			user: {
				id: user.id,
				email: user.email,
				userName: user.userName
			},
			orderSummary: {
				totalOrders: orderStats._count.id,
				totalSpent: orderStats._sum.total || 0,
				averageOrderValue: orderStats._avg.total || 0,
				largestOrder: orderStats._max.total || 0
			},
			orderStatusBreakdown: orderStatusStats.reduce((acc, stat) => {
				acc[stat.status] = stat._count.id
				return acc
			}, {}),
			recentOrders: recentOrders.map(order => ({
				id: order.id,
				date: order.createdAt,
				total: order.total,
				status: order.status,
				items: order.items.map(item => ({
					productId: item.productId,
					productTitle: item.product.title,
					productImage: item.product.imageUrl,
					quantity: item.quantity,
					price: item.price
				}))
			})),
			frequentlyPurchasedProducts: topProducts
		}
	}

	async getRecentPurchases(limit = 10) {
		// Получаем последние завершенные заказы с информацией о пользователях
		const recentOrders = await this.prisma.order.findMany({
			where: {
				status: 'COMPLETED',
				accountId: { not: null } // Только заказы авторизованных пользователей
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: limit,
			include: {
				account: {
					select: {
						id: true,
						userName: true,
						email: true,
						picture: true
					}
				},
				items: {
					include: {
						product: {
							select: {
								id: true,
								title: true,
								imageUrl: true
							}
						}
					}
				}
			}
		})

		// Форматируем данные для отображения в карточках
		return recentOrders.map(order => ({
			orderId: order.id,
			orderDate: order.createdAt,
			orderTotal: order.total,
			user: {
				id: order.account.id,
				userName: order.account.userName || 'Пользователь',
				email: order.account.email,
				picture: order.account.picture
			},
			products: order.items.map(item => ({
				id: item.product.id,
				title: item.product.title,
				image: item.product.imageUrl,
				quantity: item.quantity,
				price: item.price
			})),
			// Добавляем основной продукт для отображения в карточке
			mainProduct:
				order.items.length > 0
					? {
							id: order.items[0].product.id,
							title: order.items[0].product.title,
							image: order.items[0].product.imageUrl
						}
					: null,
			// Если в заказе больше одного товара, указываем это
			additionalProductsCount: Math.max(0, order.items.length - 1)
		}))
	}

	async getActivityFeed(limit = 20) {
		// Получаем различные типы активности для ленты
		const [recentPurchases, newUsers, productReviews] = await Promise.all([
			// Последние покупки
			this.getRecentPurchases(limit / 2),

			// Новые пользователи
			this.prisma.account.findMany({
				orderBy: {
					createdAt: 'desc'
				},
				take: limit / 4,
				select: {
					id: true,
					userName: true,
					email: true,
					picture: true,
					createdAt: true
				}
			}),

			// Последние отзывы о товарах (если у вас есть такая функциональность)
			this.prisma.productComment
				? this.prisma.productComment.findMany({
						orderBy: {
							createdAt: 'desc'
						},
						take: limit / 4,
						include: {
							account: {
								select: {
									id: true,
									userName: true,
									picture: true
								}
							},
							product: {
								select: {
									id: true,
									title: true,
									imageUrl: true
								}
							}
						}
					})
				: []
		])

		// Форматируем новых пользователей
		const newUserActivities = newUsers.map(user => ({
			type: 'NEW_USER',
			date: user.createdAt,
			user: {
				id: user.id,
				userName: user.userName || 'Новый пользователь',
				email: user.email,
				picture: user.picture
			}
		}))

		// Форматируем покупки
		const purchaseActivities = recentPurchases.map(purchase => ({
			type: 'PURCHASE',
			date: purchase.orderDate,
			user: purchase.user,
			orderId: purchase.orderId,
			orderTotal: purchase.orderTotal,
			mainProduct: purchase.mainProduct,
			additionalProductsCount: purchase.additionalProductsCount
		}))

		// Форматируем отзывы (если они есть)
		const reviewActivities = Array.isArray(productReviews)
			? productReviews.map(review => ({
					type: 'REVIEW',
					date: review.createdAt,
					user: {
						id: review.account.id,
						userName: review.account.userName || 'Пользователь',
						picture: review.account.picture
					},
					product: {
						id: review.product.id,
						title: review.product.title,
						image: review.product.imageUrl
					},
					rating: review.rating,
					comment: review.text
				}))
			: []

		// Объединяем все активности и сортируем по дате
		const allActivities = [...purchaseActivities, ...newUserActivities, ...reviewActivities].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)

		// Возвращаем ограниченное количество активностей
		return allActivities.slice(0, limit)
	}

	private getDateRangeByPeriod(period?: string): Date | null {
		if (!period) return null

		switch (period) {
			case 'day':
				const day = new Date()
				day.setHours(0, 0, 0, 0)
				return day
			case 'week':
				const week = new Date()
				week.setDate(week.getDate() - 7)
				return week
			case 'month':
				const month = new Date()
				month.setMonth(month.getMonth() - 1)
				return month
			case 'year':
				const year = new Date()
				year.setFullYear(year.getFullYear() - 1)
				return year
			default:
				return null
		}
	}
}
