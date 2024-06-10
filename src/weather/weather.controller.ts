import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from './weather.service';

// Definir las ciudades junto con sus coordenadas geográficas
const citiesData = {
  'New York': { lat: 40.7128, lon: -74.0060 },
  'London': { lat: 51.5074, lon: -0.1278 },
  'Tokyo': { lat: 35.6895, lon: 139.6917 },
};

@Controller('reportes-de-clima')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('jobs/:id')
  async getJobStatus(@Param('id') jobId: string, @Res() res: Response) {
    // Implementa la lógica para obtener el estado del job utilizando el ID proporcionado
    // Por ejemplo, podrías consultar una base de datos o alguna otra fuente de datos

    // En este ejemplo, supongamos que simplemente devolvemos un mensaje indicando que el job está en progreso
    res.status(200).json({ status: 'Job en progreso' });
  }

  @Post()
  async getWeatherReport(
    @Body('city') city: string,
    @Res() res: Response,
  ) {
    if (!(city in citiesData)) {
      return res.status(400).send('Ciudad no válida');
    }

    const { lat, lon } = citiesData[city];

    // Verificar si ya hay un job en progreso para la ciudad proporcionada
    const existingJobId = this.weatherService.getExistingJobId(city);
    if (existingJobId) {
      // Obtener la información del job existente
      const jobInfo = this.weatherService.getJobInfo(existingJobId);

      // Devolver la misma respuesta que antes manteniendo el mismo Content-Location
      res.setHeader('Content-Location', `/reportes-de-clima/jobs/${existingJobId}`);
      res.setHeader('Expires', jobInfo.expiresAt); // Fecha estimada en que el job se completará
      res.status(304).json({ job_id: existingJobId, status: 'Petición en progreso. Una tarea fue programada.' });
    } else {
      // Programar la tarea asíncrona
      const jobId = await this.weatherService.scheduleWeatherJob(city, lat, lon);

      // Devolver respuesta con headers y cuerpo adecuados
      res.setHeader('Content-Location', `/reportes-de-clima/jobs/${jobId}`);
      res.setHeader('Retry-After', '600');
      res.status(202).json({ job_id: jobId, status: 'Petición en progreso. Una tarea fue programada.' });
    }
  }
}
