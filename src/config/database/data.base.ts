
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

ConfigModule.forRoot({
    envFilePath: ['.env.development.local']
})

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'usuario',
  password: process.env.DB_PASSWORD || 'contraseña',
  database: process.env.DB_NAME || 'medical-clinic',
  autoLoadEntities: true,
  synchronize: true,
};
