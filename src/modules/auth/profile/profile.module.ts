import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { AccountService } from '../account/account.service'

@Module({
	controllers: [ProfileController],
	providers: [ProfileService, AccountService]
})
export class ProfileModule {}
