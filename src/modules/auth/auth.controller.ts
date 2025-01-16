import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../../guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  @Public()
  async create(
    @Body()
    body: {
      username: string;
      password: string;
      name: string;
      email: string;
    },
  ) {
    return this.authService.create(
      body.username,
      body.password,
      body.name,
      body.email,
    );
  }
}
