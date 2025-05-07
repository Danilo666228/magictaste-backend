import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({
		name: 'Почта пользователя',
		nullable: true
	})
	@IsEmail({}, { message: 'Некорректная почта' })
	@IsNotEmpty({ message: 'Почта не может быть пустой' })
	email: string
}
