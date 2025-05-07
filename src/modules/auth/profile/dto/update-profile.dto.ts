import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateProfileDto {
	@IsString({ message: 'Имя пользователя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
	userName: string

	@IsString({ message: 'Почта должна быть строкой' })
	@IsNotEmpty({ message: 'Почта не может быть пустой' })
	@IsEmail({}, { message: 'Некорректная почта' })
	email: string
}
