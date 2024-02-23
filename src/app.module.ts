import { join } from 'node:path'
import * as process from 'node:process'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { redisStore } from 'cache-manager-redis-store'
import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import { MulterModule } from '@nestjs/platform-express'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { TransformInterceptor } from './response/response.interceptor'
import 'winston-daily-rotate-file'
import CommonExceptionFilter from './exception/commonException.filter'
import LoggerMiddleware from './logger/logger.middleware'
import { FileModule } from './file/file.module'

@Module({
  imports: [
    // 静态资源，直接通过 http://host:port/upload/xxxxx.pdf访问
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // 配置文件
    ConfigModule.forRoot(),
    // 日志
    WinstonModule.forRoot({
      transports: [
        // file on daily rotation (error only)
        new transports.DailyRotateFile({
          // %DATE will be replaced by the current date
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`
            }),
          ),
        }),
      ],
    }),
    // 限流
    ThrottlerModule.forRoot([
      {
        // 一分钟只允许请求100次
        ttl: 60 * 1000,
        limit: 100,
      },
    ]),
    // redis 缓存
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    }),
    // 文件上传
    MulterModule.register(),
    // 授权模块
    AuthModule,
    // 用户模块
    UserModule,
    // prisma连接
    PrismaModule,
    // 文件模块
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // 全局限流
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: CommonExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
