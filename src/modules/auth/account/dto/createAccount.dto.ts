import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateAccountDto {
	@ApiProperty({
		name: 'Почта',
		example: 'danyakovin123@mail.ru',
		type: String
	})
	@IsEmail({}, { message: 'Некорректная почта' })
	@IsNotEmpty({ message: 'Почта не может быть пустой' })
	email: string
	@IsString({ message: 'Пароль должен быть строкой' })
	@IsNotEmpty({ message: 'Пароль не может быть пустым' })
	password: string
	@IsString({ message: 'Имя пользователя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
	userName: string
}
