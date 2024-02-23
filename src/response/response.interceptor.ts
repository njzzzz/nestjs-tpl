import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getReqMainInfo } from 'src/utils'
import { Logger } from 'winston'
import { Request } from 'express'

export interface Response<T> {
  data: T
  statusCode: number
  message: string
}

@Injectable()
export class TransformInterceptor<T>
implements NestInterceptor<T, Response<T>> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()
    return next.handle().pipe(
      map((data) => {
        this.logger.info('response', {
          responseData: data,
          req: getReqMainInfo(req),
        })
        return {
          data,
          message: '请求成功',
          statusCode: 200,
        }
      }),
    )
  }
}
