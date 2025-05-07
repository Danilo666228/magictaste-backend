import { IsNotEmpty, IsObject, IsString } from 'class-validator'

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
