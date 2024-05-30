import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../users/roles.guard';
import { Role } from '../users/role.enum';
import { Roles } from '../users/roles.decorator';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDiseaseDto: CreateDiseaseDto) {
    return this.diseasesService.createDisease(createDiseaseDto);
  }

  @Get()
  findAll(@Query('text') text?: string) {
    if (text) {
      return this.diseasesService.findAllDiseases(text);
    }

    return this.diseasesService.findAllDiseases();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diseasesService.findOneDisease(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    return this.diseasesService.updateDisease(+id, updateDiseaseDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diseasesService.removeDisease(+id);
  }
}
