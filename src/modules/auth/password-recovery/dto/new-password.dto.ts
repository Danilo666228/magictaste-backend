import { ConfirmPassword } from '@/shared/decorators/auth/confirm-password.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'

export class NewPasswordDto {
	@ApiProperty({
		name: ''
	})
	@IsString({ message: 'Пароль должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль не может быть пустым' })
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password: string

	@IsString({ message: 'Пароль подтверждения должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль подтверждения не может быть пустым' })
	@MinLength(6, { message: 'Пароль подтверждения должен быть не менее 6 символов' })
	@Validate(ConfirmPassword, { message: 'Пароли не совпадают' })
	passwordRepeat: string
}
