import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from 'src/config/database/data.base';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PatientsModule } from '../patients/patients.module';
import { MedicalHistoriesModule } from '../medical_histories/medical_histories.module';
import { MedicalEntriesModule } from '../medical_entries/medical_entries.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { MedicalConsultationsModule } from '../medical_consultations/medical_consultations.module';
import { PracticesModule } from '../practices/practices.module';
import { DiseasesModule } from '../diseases/diseases.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule,
    PatientsModule,
    MedicalHistoriesModule,
    MedicalEntriesModule,
    DoctorsModule,
    MedicalConsultationsModule,
    DiseasesModule,
    PracticesModule,
    AuthModule,
    UsersModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger('AppModule');

  constructor() {
    this.logger.log('AppModule initialized');
  }
}
