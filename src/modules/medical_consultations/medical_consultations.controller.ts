import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MedicalConsultationsService } from './medical_consultations.service';
import { CreateMedicalConsultationDto } from './dto/create-medical_consultation.dto';
import { UpdateMedicalConsultationDto } from './dto/update-medical_consultation.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('medical-consultations')
export class MedicalConsultationsController {
  constructor(private readonly medicalConsultationsService: MedicalConsultationsService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMedicalConsultationDto: CreateMedicalConsultationDto) {
    return this.medicalConsultationsService.createMedicalConsultation(createMedicalConsultationDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.medicalConsultationsService.findAllMedicalConsultations();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalConsultationsService.findOneMedicalConsultation(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalConsultationDto: UpdateMedicalConsultationDto) {
    return this.medicalConsultationsService.updateMedicalConsultation(+id, updateMedicalConsultationDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalConsultationsService.removeMedicalConsultation(+id);
  }
}
