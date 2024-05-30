import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical_history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical_history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MedicalHistory } from './entities/medical_history.entity';
import { Patient } from '../patients/entities/patient.entity';

@Injectable()
export class MedicalHistoriesService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalRepository: Repository<MedicalHistory>,
  ) {}

  public async findAllMedicalHistories(
    withPractices?: boolean,
    withMedicalConsultations?: boolean,
  ): Promise<MedicalHistory[]> {
    try {
      let queryBuilder = this.medicalRepository
        .createQueryBuilder('medicalHistory')
        .leftJoinAndSelect('medicalHistory.patient', 'patient')
        .leftJoinAndSelect('medicalHistory.medicalEntries', 'medicalEntries')
        .leftJoinAndSelect('medicalEntries.Doctor', 'Doctor')
        .leftJoinAndSelect('medicalEntries.Practices', 'Practices')
        .leftJoinAndSelect(
          'medicalEntries.MedicalConsultations',
          'MedicalConsultations',
        );

      if (withPractices) {
        queryBuilder = queryBuilder
          .leftJoinAndSelect('medicalEntries.Practices', 'Practices')
          .andWhere('Practices.id IS NOT NULL');
      }

      if (withMedicalConsultations) {
        queryBuilder = queryBuilder
          .leftJoinAndSelect(
            'medicalEntries.MedicalConsultations',
            'MedicalConsultations',
          )
          .andWhere('MedicalConsultations.id IS NOT NULL');
      }

      const medicalHistories = await queryBuilder.getMany();

      if (medicalHistories.length === 0) {
        throw new HttpException(
          'No se encontraron historias médicas',
          HttpStatus.BAD_REQUEST,
        );
      }

      return medicalHistories;
    } catch (error) {
      throw new HttpException(
        'Error al buscar historias médicas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneMedicalHistory(
    id: number,
    withPractices?: boolean,
    withMedicalConsultations?: boolean,
  ): Promise<MedicalHistory> {
    try {
      let queryBuilder = this.medicalRepository
        .createQueryBuilder('medicalHistory')
        .leftJoinAndSelect('medicalHistory.patient', 'patient')
        .leftJoinAndSelect('medicalHistory.medicalEntries', 'medicalEntry')
        .leftJoinAndSelect('medicalEntry.Doctor', 'Doctor')
        .leftJoinAndSelect('medicalEntry.Practices', 'Practices')
        .leftJoinAndSelect(
          'medicalEntry.MedicalConsultations',
          'MedicalConsultations',
        )
        .where('medicalHistory.id = :id', { id });

      if (withPractices) {
        queryBuilder = queryBuilder.andWhere('Practices.id IS NOT NULL');
      }

      if (withMedicalConsultations) {
        queryBuilder = queryBuilder.andWhere(
          'MedicalConsultations.id IS NOT NULL',
        );
      }

      const medicalHistory = await queryBuilder.getOne();

      if (!medicalHistory) {
        throw new HttpException(
          'No se encontró la historia médica',
          HttpStatus.BAD_REQUEST,
        );
      }

      return medicalHistory;
    } catch (error) {
      throw new HttpException(
        'Error al buscar la historia médica',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateMedicalHistory(
    id: number,
    body: UpdateMedicalHistoryDto,
  ): Promise<UpdateResult> {
    try {
      const medicalHistory: UpdateResult = await this.medicalRepository.update(
        id,
        body,
      );
      if (medicalHistory.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return medicalHistory;
    } catch (error) {
      throw new HttpException(
        'Failed to update medical history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async removeMedicalHistory(id: number): Promise<DeleteResult> {
    try {
      const medicalHistory: DeleteResult =
        await this.medicalRepository.delete(id);
      if (medicalHistory.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return medicalHistory;
    } catch (error) {
      throw new HttpException(
        'Failed to delete medical history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
