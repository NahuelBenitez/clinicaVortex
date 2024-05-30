import { Module } from '@nestjs/common';
import { MedicalEntriesService } from './medical_entries.service';
import { MedicalEntriesController } from './medical_entries.controller';
import { MedicalEntry } from './entities/medical_entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from '../medical_histories/entities/medical_history.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { MedicalConsultation } from '../medical_consultations/entities/medical_consultation.entity';
import { Practice } from '../practices/entities/practice.entity';
// import { Patient } from '../patients/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalEntry,
      MedicalHistory,
      Doctor,
      MedicalConsultation,
      Practice,
    ]),
  ],
  controllers: [MedicalEntriesController],
  providers: [MedicalEntriesService],
})
export class MedicalEntriesModule {}
