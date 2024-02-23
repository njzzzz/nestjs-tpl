// auth.module.ts

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwtStrategy'

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: 'your-secret-key', // 用于签名的密钥，你应该更改为实际使用的密钥
      signOptions: { expiresIn: '1d' }, // token 过期时间
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
