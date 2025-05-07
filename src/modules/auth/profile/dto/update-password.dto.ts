import { IsNotEmpty, MinLength } from 'class-validator'

import { IsString } from 'class-validator'

export class UpdatePasswordDto {
	@IsString()
	@IsNotEmpty()
	oldPassword: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	newPassword: string
}
