import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtGuard } from '../guards/jwt/jwt.guard';
import { JwtPayload } from '../auth/jwtPayload.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { infoUserDto } from './dto/infoUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly useService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({
    description: '用户注册',
    type: CreateUserDto,
  })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.useService.createUser(createUserDto);
    return true;
  }

  @ApiOperation({ summary: '用户登陆' })
  @ApiBody({
    description: '用户登陆',
    type: LoginUserDto,
  })
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.useService.login(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const access_token = await this.authService.createToken(
      user.username,
      user.id,
    );
    await this.cacheManager.set(`user:${user.id}`, access_token);
    return {
      accessToken: access_token,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '用户退出' })
  @Post('/logout')
  @UseGuards(JwtGuard)
  @ApiResponse({
    type: Boolean,
  })
  async logout(@Request() req) {
    // 从req上获取用户信息
    const user = req.user as JwtPayload;
    await this.cacheManager.del(`user:${user.id}`);
    return true;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @Get('/info')
  @UseGuards(JwtGuard)
  @ApiResponse({
    type: infoUserDto,
  })
  async info(@Request() req): Promise<infoUserDto> {
    // 从req上获取用户信息
    const user = req.user as JwtPayload;
    return {
      username: user.username,
    };
  }
}
