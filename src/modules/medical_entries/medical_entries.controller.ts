import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MedicalEntriesService } from './medical_entries.service';
import { CreateMedicalEntryDto } from './dto/create-medical_entry.dto';
import { UpdateMedicalEntryDto } from './dto/update-medical_entry.dto';
import { MedicalEntry } from './entities/medical_entry.entity';

@Controller('medical-entries')
export class MedicalEntriesController {
  constructor(private readonly medicalEntriesService: MedicalEntriesService) {}

  @Post('')
  async createMedicalEntry(@Body() body: CreateMedicalEntryDto): Promise<MedicalEntry> {
    return await this.medicalEntriesService.createMedicalEntry(body);
  }

  @Get()
    async findAllMedicalEntriesWithPractices(
      @Query('withPractices') withPractices: boolean,
      @Query('withMedicalConsultations') withMedicalConsultations: boolean,
      @Query('fromDate') fromDate: Date,
      @Query('toDate') toDate: Date,
      @Query('doctorLicenseNumber') doctorLicenseNumber: number,
      @Query('medicalInsurance') medicalInsurance: string,
      @Query('patientDNIs') patientDNIs: number[],
      @Query('doctorSpeciality') doctorSpeciality: string,
      @Query('diseaseName') diseaseName?: string
    ): Promise<MedicalEntry[]> {
      return this.medicalEntriesService.findAllMedicalEntries(
        withPractices, 
        withMedicalConsultations, 
        fromDate, 
        toDate, 
        doctorLicenseNumber, 
        medicalInsurance,
        patientDNIs,
        doctorSpeciality,
        diseaseName
      );
    }

  @Get(':id')
  findOneMedicalEntry(@Param('id') id: string) {
    return this.medicalEntriesService.findOneMedicalEntry(+id);
  }

  @Patch(':id')
  updateMedicalEntry(@Param('id') id: string, @Body() body: UpdateMedicalEntryDto) {
    return this.medicalEntriesService.updateMedicalEntry(+id, body);
  }

  @Delete(':id')
  removeMedicalEntry(@Param('id') id: string) {
    return this.medicalEntriesService.removeMedicalEntry(+id);
  }
}
