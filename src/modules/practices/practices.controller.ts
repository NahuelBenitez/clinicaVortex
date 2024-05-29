import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PracticesService } from './practices.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) { }
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPracticeDto: CreatePracticeDto) {
    return this.practicesService.createPractice(createPracticeDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.practicesService.findAllPractices();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practicesService.findOnePractice(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePracticeDto: UpdatePracticeDto,
  ) {
    return this.practicesService.updatePractice(+id, updatePracticeDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practicesService.removePractice(+id);
  }
}
