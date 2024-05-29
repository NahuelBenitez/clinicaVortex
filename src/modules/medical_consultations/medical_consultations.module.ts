import { Module } from '@nestjs/common';
import { MedicalConsultationsService } from './medical_consultations.service';
import { MedicalConsultationsController } from './medical_consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalConsultation } from './entities/medical_consultation.entity';
import { MedicalEntry } from '../medical_entries/entities/medical_entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalConsultation, MedicalEntry])],
  controllers: [MedicalConsultationsController],
  providers: [MedicalConsultationsService],
})
export class MedicalConsultationsModule {}
