import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { Body, Container, Heading, Hr, Img, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface TwoFactorProps {
	token: string
	metadata: SessionMetadata
	domain?: string
}

export function TwoFactorTemplate({ token, metadata, domain = '' }: TwoFactorProps) {
	return (
		<Tailwind>
			<Html>
				<Body className='bg-gray-50 font-sans'>
					<Container className='max-w-xl mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden'>
						<Section className='bg-gradient-to-r from-green-600 to-teal-600 p-8 text-center'>
							{domain && (
								<Img
									src={'/logo.png'}
									width='120'
									height='40'
									alt='Logo'
									className='mx-auto mb-4'
								/>
							)}
							<Heading className='text-2xl font-bold text-white m-0'>Двухфакторная аутентификация</Heading>
						</Section>

						<Section className='px-8 py-10'>
							<Text className='text-gray-700 text-lg mb-4'>Здравствуйте!</Text>
							<Text className='text-gray-700 mb-6'>Для завершения входа в систему используйте следующий код подтверждения:</Text>

							<div className='bg-gray-50 border border-gray-200 rounded-xl p-6 text-center mb-6'>
								<Text className='font-mono text-3xl font-bold tracking-widest text-gray-800 mb-0 letter-spacing-2'>
									{token.split('').join(' ')}
								</Text>
							</div>

							<Text className='text-gray-500 text-sm text-center'>Этот код действителен в течение 10 минут</Text>

							<Text className='text-gray-600 text-sm mt-6 border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded'>
								Никогда не сообщайте этот код никому, включая сотрудников нашей компании.
							</Text>
						</Section>

						<Hr className='border-gray-200 mx-8' />

						<Section className='bg-gray-50 m-8 p-6 rounded-xl border border-gray-100'>
							<Text className='text-gray-700 font-medium mb-3'>Информация о входе:</Text>
							<div className='flex items-center mb-2'>
								<Img
									src={`${domain}/images/icons/location.png`}
									width='16'
									height='16'
									alt='Location'
									className='mr-2'
								/>
								<Text className='text-gray-600 text-sm'>
									{metadata.location.city}, {metadata.location.country}
								</Text>
							</div>
							<div className='flex items-center'>
								<Img
									src={`${domain}/images/icons/ip.png`}
									width='16'
									height='16'
									alt='IP'
									className='mr-2'
								/>
								<Text className='text-gray-600 text-sm'>IP: {metadata.ip}</Text>
							</div>
						</Section>

						<Section className='bg-gray-100 p-6 text-center'>
							<Text className='text-gray-500 text-sm mb-2'>Если вы не пытались войти в систему, немедленно измените пароль.</Text>
							<Text className='text-gray-500 text-sm'>© 2023 Ваша Компания. Все права защищены.</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
