import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('sales')
	getSalesStatistics(@Query('period') period?: string) {
		return this.statisticsService.getSalesStatistics(period)
	}

	@Get('sales-v2')
	getSalesStatisticV2(@Query('period') period?: string) {
		return this.statisticsService.getSalesStatiscticsV2(period)
	}

	@Get('top-products')
	getTopSellingProducts(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Query('period') period?: string) {
		return this.statisticsService.getTopSellingProducts(limit, period)
	}

	@Get('customers')
	getCustomerStatistics() {
		return this.statisticsService.getCustomerStatistics()
	}

	@Get('order-statuses')
	getOrderStatusStatistics() {
		return this.statisticsService.getOrderStatusStatistics()
	}

	@Get('payment-methods')
	getPaymentMethodStatistics() {
		return this.statisticsService.getPaymentMethodStatistics()
	}

	@Get('categories')
	getCategoryPerformance() {
		return this.statisticsService.getCategoryPerformance()
	}

	@Get('dashboard')
	async getDashboardStatistics(@Query('period') period?: string) {
		const [sales, topProducts, customers, orderStatuses, paymentMethods, categories, recentPurchases, activityFeed] =
			await Promise.all([
				this.statisticsService.getSalesStatistics(period),
				this.statisticsService.getTopSellingProducts(5, period),
				this.statisticsService.getCustomerStatistics(),
				this.statisticsService.getOrderStatusStatistics(),
				this.statisticsService.getPaymentMethodStatistics(),
				this.statisticsService.getCategoryPerformance(),
				this.statisticsService.getRecentPurchases(10),
				this.statisticsService.getActivityFeed(20)
			])

		return {
			sales,
			topProducts,
			customers,
			orderStatuses,
			paymentMethods,
			categories,
			recentPurchases,
			activityFeed
		}
	}

	@Get('user/:userId')
	getUserPurchaseStatistics(@Param('userId') userId: string) {
		return this.statisticsService.getUserPurchaseStatistics(userId)
	}

	@Get('recent-purchases')
	getRecentPurchases(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
		return this.statisticsService.getRecentPurchases(limit)
	}

	@Get('activity-feed')
	getActivityFeed(@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number) {
		return this.statisticsService.getActivityFeed(limit)
	}
}
