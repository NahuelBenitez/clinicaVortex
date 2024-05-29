import { Module } from '@nestjs/common';
import { MedicalHistoriesService } from './medical_histories.service';
import { MedicalHistoriesController } from './medical_histories.controller';
import { MedicalHistory } from './entities/medical_history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistory])],
  controllers: [MedicalHistoriesController],
  providers: [MedicalHistoriesService],
})
export class MedicalHistoriesModule {}
