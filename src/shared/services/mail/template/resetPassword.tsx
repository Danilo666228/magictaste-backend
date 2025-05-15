import { SessionMetadata } from '@/core/interfaces/session-metadata'
import { Body, Button, Container, Font, Head, Heading, Hr, Img, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'
import { KeyRound } from 'lucide-react'

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
				<Head>
					<Font
						fontFamily='Roboto'
						fallbackFontFamily='Verdana'
						webFont={{
							url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
							format: 'woff2'
						}}
						fontWeight={400}
						fontStyle='normal'
					/>
				</Head>
				<Body className='font-sans'>
					<Container className='max-w-xl mx-auto my-10 rounded-xl shadow-lg overflow-hidden'>
						<Section className='p-8 text-center'>
							<Container>
								<KeyRound size={36} />
								<Heading className='text-2xl font-bold m-0'>Сброс пароля</Heading>
							</Container>
						</Section>
						<Section className='px-8 py-10'>
							<Text className='text-gray-700 text-lg mb-4'>Здравствуйте!</Text>
							<Text className='text-gray-700 mb-6'>
								Мы получили запрос на сброс пароля для вашей учетной записи. Чтобы создать новый пароль, нажмите на кнопку ниже:
							</Text>

							<Button
								href={confirmLink}
								className='box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white'>
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
							<Text className='text-gray-500 text-sm'>© 2025 MagicTaste. Все права защищены.</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
