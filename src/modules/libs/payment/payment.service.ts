import { PrismaService } from '@/core/prisma/prisma.service'
import { PaymentNotificationDto } from '@/modules/order/dto/payment-status.dto'
import { ms } from '@/shared/common/ms'
import { ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout'
import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
@Injectable()
export class PaymentService {
	private readonly yookassaService: YooCheckout
	public constructor(private readonly prismaService: PrismaService) {
		this.yookassaService = new YooCheckout({ shopId: '1093746', secretKey: 'test_1Z2jUTEBI7nksS6sugtn2EXyA5B7fUMbsVTAEo7hi-M' })
	}

	public async createPayment(paymentData: ICreatePayment) {
		const indenpotentKey = v4()

		const payment = await this.yookassaService.createPayment(paymentData, indenpotentKey)
		setTimeout(async () => {
			const currentOrder = await this.prismaService.order.findUnique({
				where: {
					id: payment.metadata.orderId
				}
			})
			if (currentOrder?.status === 'WAITING_FOR_PAYMENT') {
				await this.prismaService.order.update({
					where: {
						id: currentOrder.id
					},
					data: {
						status: 'CANCELED',
						paymentStatus: 'FAILED'
					}
				})
			}
		}, ms('10m'))
		return payment
	}
	public async cancelPayment(paymentId: string) {
		const indenpotentKey = v4()
		return await this.yookassaService.cancelPayment(paymentId, indenpotentKey)
	}

	public async getPayments() {
		return await this.yookassaService.getPaymentList()
	}

	public async handleNotification(dto: PaymentNotificationDto) {
		const payment = await this.yookassaService.getPayment(dto.object.id)

		if (dto.event === 'payment.waiting_for_capture') {
			return await this.yookassaService.capturePayment(dto.object.id, payment)
		}

		if (dto.event === 'payment.succeeded') {
			return await this.prismaService.order.update({
				where: {
					id: payment.metadata.orderId
				},
				data: {
					status: 'PAYED',
					paymentStatus: 'COMPLETED'
				}
			})
		}
	}
}
