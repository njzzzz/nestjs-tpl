// auth.service.ts

import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { JwtPayload } from './jwtPayload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createToken(username: string, id: number) {
    const payload: JwtPayload = { username, id }
    return this.jwtService.sign(payload)
  }

  async validateUserByJwt(payload: JwtPayload) {
    const hasUser = await this.cacheManager.get(`user:${payload.id}`)
    // 根据 payload 中的信息验证用户
    // 例如，从数据库中检索用户信息并返回
    // 请根据你的实际需求进行实现
    return hasUser ? payload : false
  }
}
