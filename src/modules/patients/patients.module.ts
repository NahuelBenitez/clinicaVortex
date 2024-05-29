import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { MedicalHistory } from '../medical_histories/entities/medical_history.entity';
import { MedicalEntry } from '../medical_entries/entities/medical_entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, MedicalHistory, MedicalEntry])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
