import { OmitType } from '@nestjs/mapped-types';
import { User } from '../schemas/user.schema';

export class UserResponseDto extends OmitType(User, ['password'] as const) {}
