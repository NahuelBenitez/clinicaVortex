import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  private jobAttempts = new Map<string, { jobId: string; expiresAt: string }>();

  @Cron('0 0 * * * *') // Ejecutar cada hora
  async refreshWeatherData() {
    this.logger.debug('Actualizando datos climáticos...');
    
    try {
      // Aquí podrías realizar llamadas a la API para obtener los datos climáticos y actualizar tu base de datos o cualquier otra lógica necesaria
      // Por ejemplo:
      const cities = [
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'Tokyo', lat: 35.6895, lon: 139.6917 }
      ];
      for (const city of cities) {
        await this.fetchWeather(city.name, city.lat, city.lon);
      }

      // Una vez que hayas actualizado los datos climáticos, puedes registrar un mensaje de éxito
      this.logger.debug('Datos climáticos actualizados correctamente.');
    } catch (error) {
      // Si ocurre algún error durante la actualización de los datos climáticos, puedes registrar un mensaje de error
      this.logger.error('Error al actualizar los datos climáticos:', error);
    }
  }

  @Timeout(20000) // Ejecutar después de 10 segundos
  async fetchWeather(city: string, lat?: number, lon?: number) {
    try {
      if (!city) {
        throw new Error('La ciudad no puede ser undefined');
      }

      let apiUrl = '';
      if (lat && lon) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f9d31ec21c9a96f75f0a1c919fae0532`;
      } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6216bdc4b37fe20cef7c85714472f351`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      // Implementa la lógica para guardar los datos climáticos o notificar al usuario
      this.logger.debug(`Datos climáticos obtenidos para ${city}:`, data);
    } catch (error) {
      this.logger.error(`Error al obtener el clima para ${city}:`, error);
      // Implementa la lógica para manejar el error
    } finally {
      // Incrementar el contador de intentos
      const attempts = Number(this.jobAttempts.get(city)?.jobId) || 0;
      this.jobAttempts.set(city, { jobId: String(attempts + 1), expiresAt: '' }); // No hay fecha de expiración al reiniciar el contador
    }
  }

  async scheduleWeatherJob(city: string, lat?: number, lon?: number): Promise<string> {
    if (!city) {
      throw new Error('La ciudad no puede ser undefined');
    }

    const jobId = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 10 * 60000).toISOString(); // 10 minutos desde ahora
    this.jobAttempts.set(city, { jobId, expiresAt });
    this.fetchWeather(city, lat, lon);
    return jobId;
  }

  getJobProgress(city: string): number {
    // Calcular el progreso basado en la cantidad de intentos
    const attempts = Number(this.jobAttempts.get(city)?.jobId) || 0;
    const maxAttempts = 10; // Establecer el número máximo de intentos
    return (attempts / maxAttempts) * 100;
  }

  getJobAttempts(city: string): number {
    // Obtener el número de intentos de trabajo
    return Number(this.jobAttempts.get(city)?.jobId) || 0;
  }

  getExistingJobId(city: string): string | undefined {
    // ID del trabajo existente para una ciudad específica, si existe
    return this.jobAttempts.get(city)?.jobId;
  }

  getJobInfo(jobId: string): { jobId: string; expiresAt: string } {
    // Obtener la información del trabajo para un ID de trabajo dado
    return this.jobAttempts.get(jobId);
  }
}
