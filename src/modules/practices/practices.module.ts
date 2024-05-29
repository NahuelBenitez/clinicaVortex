import { Module } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { PracticesController } from './practices.controller';
import { Practice } from './entities/practice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalEntry } from '../medical_entries/entities/medical_entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Practice, MedicalEntry])],
  controllers: [PracticesController],
  providers: [PracticesService],
})
export class PracticesModule {}
