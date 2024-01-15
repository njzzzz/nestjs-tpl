import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Example')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/a')
  @UseGuards(AuthGuard('jwt'))
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get/token')
  getToken() {
    return this.authService.createToken('admin', 1);
  }

  @Post('/user/create')
  createUser() {
    return this.userService.createUser({
      username: 'xxx',
      password: 'xxx',
    });
  }
}
