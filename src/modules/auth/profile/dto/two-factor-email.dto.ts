import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class TwoFactorEmailDto {
	@ApiProperty({
		description: 'Включить или отключить двухфакторную аутентификацию по email',
		example: true,
		type: Boolean
	})
	@IsBoolean()
	public readonly isTwoFactorEmailEnabled: boolean
}
