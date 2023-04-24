import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../core/file-upload/file.upload';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'logo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './public/animals',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  async updatePet(
    @Req() req: any,
    @Body() body: UpdatePetDto,
    @Res() res: any,
    @Param('id') id: string,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; logo?: Express.Multer.File[] },
  ) {
    if (files?.image) {
      body.image = `./public/animals ${files[0].filename}`;
    }
    if (files?.logo) {
      body.logo = `./public/animals ${files[0].filename}`;
    }
    return res.status(HttpStatus.OK).json(await this.petsService.update(body));
  }
}
