import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
  @UseGuards(AuthGuard)
  @Post('')
  createPatient(@Body() body: CreatePatientDto) {
    return this.patientsService.createPatient(body);
  }
  @UseGuards(AuthGuard)
  @Get('')
  findAllPatients() {
    return this.patientsService.findAllPatients();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOnePatient(@Param('id') id: string) {
    return this.patientsService.findOnePatient(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  updatePatient(@Param('id') id: string, @Body() body: UpdatePatientDto) {
    return this.patientsService.updatePatient(+id, body);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  removePatient(@Param('id') id: string) {
    return this.patientsService.removePatient(+id);
  }
}
