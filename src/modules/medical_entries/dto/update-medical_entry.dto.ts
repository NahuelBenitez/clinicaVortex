import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalEntryDto } from './create-medical_entry.dto';

export class UpdateMedicalEntryDto extends PartialType(CreateMedicalEntryDto) {}
