import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from "../users/dto/update-user.dto";
import { User } from "@prisma/client";

@Injectable()
export class PetsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {
  }

  async createPet(petData: CreatePetDto, userId: string) {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new HttpException('no user', HttpStatus.NOT_FOUND);
    }
    return this.prismaService.pets.create({
      data: {
        image: petData.image,
        logo: petData.logo,
        name: petData.name,
        status: petData.status,
        type: petData.type,
        ownerId: user.id,
      },
    });
  }

  async update(petData: any) {
    // const user = await this.userService.getById(userId);
    // if (!user) {
    //   throw new HttpException('no user', HttpStatus.NOT_FOUND);
    // }
    return this.prismaService.pets.create({
      data: {
        image: petData.image,
        logo: petData.logo,
        name: petData.name,
        status: petData.status,
        type: petData.type,
      },
    });
  }
}