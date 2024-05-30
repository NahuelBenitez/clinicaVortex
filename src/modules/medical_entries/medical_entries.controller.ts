import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MedicalEntriesService } from './medical_entries.service';
import { CreateMedicalEntryDto } from './dto/create-medical_entry.dto';
import { UpdateMedicalEntryDto } from './dto/update-medical_entry.dto';
import { MedicalEntry } from './entities/medical_entry.entity';

@Controller('medical-entries')
export class MedicalEntriesController {
  constructor(private readonly medicalEntriesService: MedicalEntriesService) {}

  @Post('')
  async create(
    @Body() body: CreateMedicalEntryDto,
  ): Promise<MedicalEntry> {
    return await this.medicalEntriesService.create(body);
  }

  @Get()
  async findAll(
    @Query('withPractices') withPractices: boolean, //Query por cada consulta que haga y parametro
    @Query('withMedicalConsultations') withMedicalConsultations: boolean,
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
    @Query('doctorLicenseNumber') doctorLicenseNumber: number,
    @Query('medicalInsurance') medicalInsurance: string,
    @Query('doctorSpeciality') doctorSpeciality: string,
    @Query('diseaseName') diseaseName?: string,
  ): Promise<MedicalEntry[]> {
    return this.medicalEntriesService.findAll(
      withPractices,
      withMedicalConsultations,
      fromDate,
      toDate,
      doctorLicenseNumber,
      medicalInsurance,
      doctorSpeciality,
      diseaseName,
    );
  }

  @Get(':id')
  findOneMedicalEntry(@Param('id') id: string) {
    return this.medicalEntriesService.findOneMedicalEntry(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateMedicalEntryDto) {
    return this.medicalEntriesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalEntriesService.remove(+id);
  }
}
