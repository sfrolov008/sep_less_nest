import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './core/orm/prisma.module';

@Module({
  imports: [UsersModule, PetsModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaModule],
})
export class AppModule {}
