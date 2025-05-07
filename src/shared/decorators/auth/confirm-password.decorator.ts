import { SignUpDto } from '@/modules/auth/account/dto/sign-up.dto'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'confirmPassword', async: false })
export class ConfirmPassword implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as SignUpDto
		return obj.password === passwordRepeat
	}
	public defaultMessage(): string {
		return 'Пароли не совпадают'
	}
}
