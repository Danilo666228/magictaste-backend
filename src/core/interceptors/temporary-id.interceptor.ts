import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class TemporaryIdInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest()

		const temporaryId = request.headers['temporary-id'] || request.session?.accountId

		request.temporaryId = temporaryId

		return next.handle()
	}
}
