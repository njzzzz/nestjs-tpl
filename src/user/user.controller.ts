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

@Controller('user')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly useService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.useService.createUser(createUserDto);
    return true;
  }

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

  @Post('/logout')
  @UseGuards(JwtGuard)
  async logout(@Request() req) {
    // 从req上获取用户信息
    const user = req.user as JwtPayload;
    await this.cacheManager.del(`user:${user.id}`);
    return true;
  }

  @Get('/info')
  @UseGuards(JwtGuard)
  async info(@Request() req) {
    // 从req上获取用户信息
    const user = req.user as JwtPayload;
    return {
      username: user.username,
    };
  }
}
