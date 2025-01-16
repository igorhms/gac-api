import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { sys_default_msg } from 'src/utils/system-messages';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ username: string; access_token: string }> {
    const user = await this.validateUserCredentials(username, password);
    const payload = { username: user.username };
    return {
      username,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async create(
    username: string,
    password: string,
    name: string,
    email: string,
  ): Promise<Partial<User>> {
    const newUser = await this.usersService.create(
      username,
      password,
      name,
      email,
    );
    return newUser;
  }

  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await this.validatePassword(password, user.password))) {
      return user;
    }
    throw new BadRequestException(
      'Dados incorretos. Verifique os dados e tente novamente',
    );
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
