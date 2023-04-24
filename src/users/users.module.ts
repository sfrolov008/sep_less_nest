import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../core/orm/prisma.service';
import { PetsModule } from '../pets/pets.module';
import { PetsService } from '../pets/pets.service';

@Module({
  imports: [forwardRef(() => PetsModule)],
  providers: [UsersService, PrismaService, PetsService],
  controllers: [UsersController],
})
export class UsersModule {}
