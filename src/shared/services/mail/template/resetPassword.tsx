import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { Body, Button, Container, Heading, Hr, Img, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface ResetPasswordProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export function ResetPasswordTemplate({ domain, token, metadata }: ResetPasswordProps) {
	const confirmLink = `${domain}/auth/password-recovery?token=${token}`
	return (
		<Tailwind>
			<Html>
				<Body className='bg-gray-50 font-sans'>
					<Container className='max-w-xl mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden'>
						{/* Header with logo */}
						<Section className='bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center'>
							{/* Replace with your actual logo */}
							<Img
								src={`${domain}/images/logo-white.png`}
								width='120'
								height='40'
								alt='Logo'
								className='mx-auto mb-4'
							/>
							<Heading className='text-2xl font-bold text-white m-0'>Сброс пароля</Heading>
						</Section>

						<Section className='px-8 py-10'>
							<Text className='text-gray-700 text-lg mb-4'>Здравствуйте!</Text>
							<Text className='text-gray-700 mb-6'>
								Мы получили запрос на сброс пароля для вашей учетной записи. Чтобы создать новый пароль, нажмите на кнопку ниже:
							</Text>

							<Button
								href={confirmLink}
								className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg py-3 px-8 text-center block mx-auto transition-all shadow-md hover:shadow-lg'>
								Сбросить пароль
							</Button>

							<Text className='text-gray-500 text-sm mt-6 text-center'>Эта ссылка действительна в течение 1 часа</Text>

							<Text className='text-gray-600 text-sm mt-6 border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded'>
								Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо или свяжитесь с нашей службой
								поддержки.
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
							<Text className='text-gray-500 text-sm'>© 2023 Ваша Компания. Все права защищены.</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
