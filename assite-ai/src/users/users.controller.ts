import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser, CreateUserDto } from './dto/create-user.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { User } from './schemas/user.schema';
import { UpdateUserSchema, UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/utils/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Public()
  async createUser(
    @Body(new ZodValidationPipe(CreateUser)) payload: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(payload);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) payload: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
