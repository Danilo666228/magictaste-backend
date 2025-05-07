import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { Body, Button, Container, Heading, Hr, Img, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface VerifyEmailProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export function VerifyTemplate({ domain, token, metadata }: VerifyEmailProps) {
	const confirmLink = `${domain}/auth/verification?token=${token}`
	return (
		<Tailwind>
			<Html>
				<Body className='bg-gray-50 font-sans'>
					<Container className='max-w-xl mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden'>
						<Section className='bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center'>
							<Img
								src={`${domain}/images/logo-white.png`}
								width='120'
								height='40'
								alt='Logo'
								className='mx-auto mb-4'
							/>
							<Heading className='text-2xl font-bold text-white m-0'>Подтверждение почты</Heading>
						</Section>

						<Section className='px-8 py-10'>
							<Text className='text-gray-700 text-lg mb-4'>Здравствуйте!</Text>
							<Text className='text-gray-700 mb-6'>
								Благодарим вас за регистрацию. Чтобы активировать вашу учетную запись и подтвердить электронную почту, пожалуйста,
								нажмите на кнопку ниже:
							</Text>

							<Button
								href={confirmLink}
								className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors'>
								Подтвердить почту
							</Button>

							<Text className='text-gray-500 text-sm mt-6 text-center'>Эта ссылка действительна в течение 1 часа</Text>
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
							<Text className='text-gray-500 text-sm mb-2'>Если вы не запрашивали это письмо, просто проигнорируйте его.</Text>
							<Text className='text-gray-500 text-sm'>© 2023 Ваша Компания. Все права защищены.</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
