import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/image.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/Auth.decorator';

@Controller('image')
@ApiTags("image")
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post()
  create(@Body() ImageDto: ImageDto) {
    return this.imageService.create(ImageDto);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
