import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { validateFileFormat } from '../utils/file.utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: Express.Multer.File) {
		if (!value) {
			throw new BadRequestException('Файл не загружен')
		}

		const { originalname, size } = value

		const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp']

		const isFileFormatValid = validateFileFormat(originalname.split('.')[1], allowedFormats)

		if (!isFileFormatValid) {
			throw new BadRequestException('Неверный формат файла')
		}

		const isFileSizeValid = size >= 10 * 1024 * 1024

		if (isFileSizeValid) {
			throw new BadRequestException('Файл превышает 10 МБ')
		}

		return value
	}
}
