import {
	DeleteObjectCommand,
	DeleteObjectCommandInput,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client
} from '@aws-sdk/client-s3'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sharp from 'sharp'

interface UploadOptions {
	buffer: Buffer
	key: string
	contentType: string
	resize?: {
		width?: number
		height?: number
	}
	quality?: number
}

@Injectable()
export class StorageService {
	private readonly client: S3Client
	private readonly bucket: string
	private readonly logger = new Logger(StorageService.name)

	public constructor(private readonly configService: ConfigService) {
		this.client = new S3Client({
			endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
			region: this.configService.getOrThrow<string>('S3_REGION'),
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY')
			}
		})

		this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
	}

	/**
	 * Загружает изображение в S3 с возможностью обработки
	 */
	public async uploadImage(options: UploadOptions): Promise<string> {
		const { buffer, key, contentType, resize, quality = 80 } = options

		try {
			let processedBuffer = buffer
			let finalContentType = contentType

			// Обработка изображения
			if (this.isImage(contentType)) {
				const imageProcessor = sharp(buffer)

				if (resize) {
					imageProcessor.resize(resize.width, resize.height)
				}
				if (key.endsWith('.gif')) {
					processedBuffer = await imageProcessor.webp({ quality }).toBuffer()
					finalContentType = 'image/webp'
				}
			}

			const command: PutObjectCommandInput = {
				Bucket: this.bucket,
				Key: key,
				Body: processedBuffer,
				ContentType: finalContentType
			}

			await this.client.send(new PutObjectCommand(command))

			return key
		} catch (error) {
			this.logger.error(`Failed to upload image: ${error.message}`, error.stack)
			throw new Error(`Failed to upload image: ${error.message}`)
		}
	}

	/**
	 * Удаляет файл из S3
	 */
	public async remove(key: string): Promise<void> {
		try {
			const command: DeleteObjectCommandInput = {
				Bucket: this.bucket,
				Key: key
			}

			await this.client.send(new DeleteObjectCommand(command))
		} catch (error) {
			this.logger.error(`Failed to remove file: ${error.message}`, error.stack)
			throw new Error(`Failed to remove file: ${error.message}`)
		}
	}

	/**
	 * Проверяет, является ли файл изображением
	 */
	private isImage(contentType: string): boolean {
		return contentType.startsWith('image/')
	}
}
