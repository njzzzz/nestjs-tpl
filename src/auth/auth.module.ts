// auth.module.ts
import * as process from 'node:process'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwtStrategy'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET, // 用于签名的密钥，你应该更改为实际使用的密钥
      signOptions: { expiresIn: +process.env.TOKEN_TTL }, // token 过期时间
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
