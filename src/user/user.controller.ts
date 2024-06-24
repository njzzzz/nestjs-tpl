import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { getUserRedisKey } from 'src/common/utils'
import { AuthService } from '../auth/auth.service'
import { JwtGuard } from '../guards/jwt/jwt.guard'
import { JwtPayload } from '../auth/jwtPayload.interface'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { infoUserDto } from './dto/infoUser.dto'
import { loginUserResDto } from './dto/loginUserResponse.dto'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private readonly useService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({
    description: '用户注册',
    type: CreateUserDto,
  })
  @ApiResponse({
    type: Boolean,
    description: '是否注册成功',
    status: 200,
  })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.useService.createUser(createUserDto)
    return true
  }

  @ApiOperation({ summary: '用户登陆' })
  @ApiBody({
    description: '用户登陆',
    type: LoginUserDto,
  })
  @ApiResponse({
    type: loginUserResDto,
  })
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.useService.login(loginUserDto)
    if (!user)
      throw new UnauthorizedException('用户名或密码错误')
    const access_token = await this.authService.createToken(user)
    await this.cacheManager.set(getUserRedisKey(user), user, { ttl: +process.env.TOKEN_TTL })
    return {
      accessToken: access_token,
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '用户退出' })
  @ApiResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard)
  @Post('/logout')
  async logout(@Request() req) {
    // 从req上获取用户信息
    const user = req.user as JwtPayload
    await this.cacheManager.del(getUserRedisKey(user))
    return true
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({
    type: infoUserDto,
  })
  @UseGuards(JwtGuard)
  @Get('/info')
  async info(@Request() req): Promise<infoUserDto> {
    // 从req上获取用户信息
    const user = req.user as JwtPayload
    return {
      username: user.username,
    }
  }
}
