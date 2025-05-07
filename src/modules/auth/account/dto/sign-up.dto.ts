import { ConfirmPassword } from '@/shared/decorators/auth/confirm-password.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'

export class SignUpDto {
	@ApiProperty({
		name: 'Имя пользователя',
		type: String,
		description: 'Отображаемое имя пользователя'
	})
	@IsString({ message: 'Имя пользователя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
	userName: string

	@ApiProperty({
		name: 'Почта пользователя',
		type: String
	})
	@IsString({ message: 'Почта должна быть строкой' })
	@IsEmail({}, { message: 'Некорректная почта' })
	@IsNotEmpty({ message: 'Почта не может быть пустой' })
	email: string

	@ApiProperty({
		name: 'Пароль пользователя',
		type: String,
		description: 'Пароль для входа в систему'
	})
	@IsString({ message: 'Пароль должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль не может быть пустым' })
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password: string

	@ApiProperty({
		name: 'Повторный пароль',
		type: String
	})
	@IsString({ message: 'Пароль подтверждения должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль подтверждения не может быть пустым' })
	@MinLength(6, { message: 'Пароль подтверждения должен быть не менее 6 символов' })
	@Validate(ConfirmPassword, { message: 'Пароли не совпадают' })
	passwordRepeat: string
}
