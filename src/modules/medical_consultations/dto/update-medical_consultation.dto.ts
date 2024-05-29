import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalConsultationDto } from './create-medical_consultation.dto';

export class UpdateMedicalConsultationDto extends PartialType(CreateMedicalConsultationDto) {}
