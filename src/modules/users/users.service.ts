import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneById(id: string): Promise<User> {
    try {
      return this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      return this.userModel.findOne({ username }).exec();
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      throw new BadRequestException(
        'Ocorreu um erro ao buscar os usuários. Tente novamente mais tarde',
      );
    }
  }

  async create(
    username: string,
    password: string,
    name: string,
    email: string,
  ): Promise<Partial<User>> {
    try {
      const newUser = new this.userModel({ username, password, name, email });
      await newUser.save();
      return { username, name, email };
    } catch (error) {
      throw new BadRequestException(
        'Ocorreu um erro ao criar o usuário. Verique os dados e tente novamente',
      );
    }
  }
}
