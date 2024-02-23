// jwt-strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from './jwtPayload.interface'
import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // 用于验证签名的密钥，你应该更改为实际使用的密钥
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUserByJwt(payload)
    if (!user)
      throw new UnauthorizedException()

    return user
  }
}
