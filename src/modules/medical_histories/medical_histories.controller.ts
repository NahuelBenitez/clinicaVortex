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
import { MedicalHistoriesService } from './medical_histories.service';
import { CreateMedicalHistoryDto } from './dto/create-medical_history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical_history.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('medical-histories')
export class MedicalHistoriesController {
  constructor(
    private readonly medicalHistoriesService: MedicalHistoriesService,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('withPractices') withPractices?: boolean,
    @Query('withMedicalConsultations') withMedicalConsultations?: boolean,
  ) {
    return this.medicalHistoriesService.findAllMedicalHistories(
      withPractices,
      withMedicalConsultations,
    );
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @Query('withPractices') withPractices?: boolean,
    @Query('withMedicalConsultations') withMedicalConsultations?: boolean,
  ) {
    return this.medicalHistoriesService.findOneMedicalHistory(
      id,
      withPractices,
      withMedicalConsultations,
    );
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateMedicalHistory(
    @Param('id') id: string,
    @Body() body: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoriesService.updateMedicalHistory(+id, body);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  removeMedicalHistory(@Param('id') id: string) {
    return this.medicalHistoriesService.removeMedicalHistory(+id);
  }
}
