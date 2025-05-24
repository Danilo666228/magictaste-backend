import { IsNotEmpty, IsObject, IsString } from 'class-validator'
import { Payment } from '@a2seven/yoo-checkout'
export class PaymentStatusDto {
	@IsString()
	@IsNotEmpty()
	event: string

	@IsObject()
	@IsNotEmpty()
	object: {
		id: string
		status: string
		description: string
		metadata?: Record<string, any>
	}
}
export class PaymentNotificationDto {
	event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled' | 'refund.succeeded'
	type: 'notification'
	object: Payment
}
