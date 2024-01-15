import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './response/response.interceptor';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import CommonExceptionFilter from './exception/commonException.filter';
import LoggerMiddleware from './logger/logger.middleware';
console.log('process.env', process.env.REDIS_HOST, process.env.NODE_ENV);

@Module({
  imports: [
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
              return `${info.timestamp} ${info.level}: ${info.message}`;
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
    // mysql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          // 不要在生产环境使用
          synchronize: true,
        };
      },
    }),
    // 授权模块
    AuthModule,
    // 用户模块
    UserModule,
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
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
