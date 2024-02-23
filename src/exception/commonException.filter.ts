import { ArgumentsHost, Catch, HttpException, Inject } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { getReqMainInfo } from 'src/utils'
import { Logger } from 'winston'

@Catch()
export default class CommonExceptionFilter extends BaseExceptionFilter {
  // 注入日志服务相关依赖
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super()
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      // 记录日志（错误消息，错误码，请求信息等）
      this.logger.error(exception.message, {
        status,
        req: getReqMainInfo(request),
        stack: exception.stack,
      })
      // 调用原有的异常处理方法
      super.catch(exception, host)
    }
    else {
      this.logger.error('codeError', {
        req: getReqMainInfo(request),
        stack: (exception as Error).stack,
      })
      // 调用原有的异常处理方法
      super.catch(exception, host)
    }
  }
}
