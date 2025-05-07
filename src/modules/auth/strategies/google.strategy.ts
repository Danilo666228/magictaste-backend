import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private configService: ConfigService) {
		super({
			clientID: configService.get('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
			callbackURL: 'http://localhost:5000/api/auth/google/callback',
			scope: ['email', 'profile']
		})
	}

	public async validate(profile: Profile, _accessToken: string, _refreshToken: string, done: VerifyCallback) {
		const { emails, photos, username } = profile

		const user = {
			email: emails?.[0]?.value || '',
			name: username || ''
		}
		done(null, user)
	}
}
