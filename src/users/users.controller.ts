import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../core/file-upload/file.upload';
import { CreatePetDto } from '../pets/dto/create-pet.dto';
import { PetsService } from '../pets/pets.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly petsService: PetsService,
  ) {}

  @Get()
  async getAll(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json(await this.userService.getAll());
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  async getById(@Req() req: any, @Res() res: any, @Param('id') id: string) {
    return res.status(HttpStatus.OK).json(await this.userService.getById(id));
  }
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  async create(
    @Req() req: any,
    @Body() body: CreateUserDto,
    @Res() res: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    if (file) {
      body.avatar = `public/${file.filename}`;
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.userService.create(body));
  }

  @ApiParam({ name: 'id', required: true })
  @Patch('/:id')
  async update(
    @Req() req: any,
    @Res() res: any,
    @Body() body: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<User> {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.update(id, body));
  }

  @Delete('/:id')
  async remove(
    @Req() req: any,
    @Res() res: any,
    @Param('id') id: string,
  ): Promise<void> {
    await res.status(HttpStatus.ACCEPTED).json(this.userService.delete(id));
  }

  @Post('/pets/:userId') async createPet(
    @Req() req: any,
    @Body() body: CreatePetDto,
    @Res() res: any,
    @Param('id') userId: string,
  )
  {
    const user = await this.userService.getById(userId);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `user with ${userId} not found` });
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.petsService.createPet(body, userId));
  }
}
