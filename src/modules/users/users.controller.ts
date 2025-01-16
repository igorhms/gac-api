import { Controller, Get, Param } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.usersService.findOneById(id);
  }
}
