import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../core/orm/prisma.service';
import { IUserInfo } from './interfaces/user.info';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async getById(id: string): Promise<IUserInfo> {
    return this.prismaService.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        age: true,
        avatar: true,
        city: true,
        email: true,
        name: true,
      },
    });
  }

  async create(userData: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        age: userData.age,
        avatar: userData.avatar,
        city: userData.city,
        email: userData.email,
        name: userData.name,
        status: userData.status,
      },
    });
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id: Number(id) },
      data: {
        name: userData.name,
        age: userData.age,
        email: userData.email,
        city: userData.city,
        status: userData.status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id: Number(id) },
    });
  }

  async findByUsername(userEmail: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        email: userEmail,
      },
    });
  }
}
