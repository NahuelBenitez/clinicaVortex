
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
