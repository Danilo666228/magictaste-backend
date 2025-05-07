import 'express-session'
import { type SessionMetadata } from './session-metadata'

declare module 'express-session' {
	interface SessionData {
		id: string
		accountId?: string
		createdAt?: Date | string
		metadata: SessionMetadata
		roles?: RoleName[]
		temporaryId?: string
	}
}
