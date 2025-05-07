import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class SignInDto {
	@ApiProperty({
		name: 'Почта пользователя',
		type: 'string'
	})
	@IsString({ message: 'Почта должна быть строкой' })
	@IsEmail({}, { message: 'Некорректная почта' })
	@IsNotEmpty({ message: 'Почта не может быть пустой' })
	email: string

	@ApiProperty({
		name: 'Пароль пользователя',
		type: 'string'
	})
	@IsString({ message: 'Пароль должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль не может быть пустым' })
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password: string

	@ApiProperty({
		name: '2FA TOTP код',
		type: 'string',
		required: false
	})
	@IsString()
	@IsOptional()
	totpCode?: string

	@ApiProperty({
		name: '2FA Email код',
		type: 'string',
		required: false
	})
	@IsString()
	@IsOptional()
	emailCode?: string
}
