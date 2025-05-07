import { IsNotEmpty, IsString } from 'class-validator'

export class CreateDeliveryAddressDto {
	@IsString({ message: 'Город должен быть строкой' })
	@IsNotEmpty({ message: 'Город не может быть пустым' })
	city: string
	@IsString({ message: 'Улица должен быть строкой' })
	@IsNotEmpty({ message: 'Улица не может быть пустой' })
	street: string
	@IsString({ message: 'Дом должен быть строкой' })
	@IsNotEmpty({ message: 'Дом не может быть пустой' })
	house: string
	@IsString({ message: 'Квартира должен быть строкой' })
	@IsNotEmpty({ message: 'Квартира не может быть пустой' })
	flat: string
}
