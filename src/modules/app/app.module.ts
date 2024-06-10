import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
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
import { RequestsLoggerMiddleware } from 'src/middleware/request-logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherService } from 'src/weather/weather.service';

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
    WeatherModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, WeatherService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestsLoggerMiddleware).forRoutes('*');
  }
 
  private readonly logger = new Logger('AppModule');

  constructor() {
    this.logger.log('AppModule initialized');
  }
}
