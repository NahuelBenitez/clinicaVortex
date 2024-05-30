import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicalEntryDto } from './dto/create-medical_entry.dto';
import { UpdateMedicalEntryDto } from './dto/update-medical_entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalEntry } from './entities/medical_entry.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { MedicalHistory } from '../medical_histories/entities/medical_history.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class MedicalEntriesService {
  constructor(
    @InjectRepository(MedicalEntry)
    private readonly medicalEntryRepository: Repository<MedicalEntry>,
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(body: CreateMedicalEntryDto): Promise<MedicalEntry> {
    try {
      const { date, medicalHistoryId, doctorId } = body;
      const medicalHistory = await this.medicalHistoryRepository.findOne({
        where: { id: medicalHistoryId },
      });
      const doctor = await this.doctorRepository.findOne({
        where: { id: doctorId },
      });

      if (!medicalHistory || !doctor) {
        throw new HttpException(
          'Medical history or doctor not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const newMedicalEntry = this.medicalEntryRepository.create({
        date,
        medicalHistory: medicalHistory,
        Doctor: doctor,
      });

      return await this.medicalEntryRepository.save(newMedicalEntry);
    } catch (error) {
      throw new HttpException(
        'Failed to create medical entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    //primero agrego parametros con su tipo
    withPractices?: boolean,
    withMedicalConsultations?: boolean,
    fromDate?: Date,
    toDate?: Date,
    doctorLicenseNumber?: number,
    medicalInsurance?: string,
    doctorSpeciality?: string,
    diseaseName?: string,
  ): Promise<MedicalEntry[]> {
    try {
      let queryBuilder = this.medicalEntryRepository
        .createQueryBuilder('medicalEntry') //creo consulta desde medicalEntry
        .leftJoinAndSelect('medicalEntry.medicalHistory', 'MedicalHistory') //relaciones
        .leftJoinAndSelect('MedicalHistory.patient', 'Patient')
        .leftJoinAndSelect('medicalEntry.Doctor', 'Doctor')
        .leftJoinAndSelect('medicalEntry.Practices', 'Practices')
        .leftJoinAndSelect(
          'medicalEntry.MedicalConsultations',
          'MedicalConsultations',
        )
        .leftJoinAndSelect('MedicalConsultations.Disease', 'Disease')
        .select([
          'medicalEntry',
          'Doctor',
          'MedicalHistory',
          'Practices',
          'MedicalConsultations',
          'Disease',
        ]) //consulta de consulta basicamente
        .addSelect(['MedicalHistory.id', 'Patient']) //para tener al paciente agregando relacion
        .where('Patient.isDeleted = false');
      //PARA FECHAS DESDE HASTA
      if (fromDate || toDate) {
        if (fromDate && toDate) {
          queryBuilder = queryBuilder.where(
            'medicalEntry.date BETWEEN :fromDate AND :toDate',
            { fromDate, toDate },
          );
        } else if (fromDate) {
          queryBuilder = queryBuilder.where('medicalEntry.date >= :fromDate', {
            fromDate,
          });
        } else {
          queryBuilder = queryBuilder.where('medicalEntry.date <= :toDate', {
            toDate,
          });
        }
      }
      //CONSULTAS
      if (withMedicalConsultations) {
        queryBuilder = queryBuilder.where(
          'MedicalConsultations.id IS NOT NULL',
        );
      }
      //PRACTICAS
      if (withPractices) {
        queryBuilder = queryBuilder.where('Practices.id IS NOT NULL');
      }
      //MATRICULA
      if (doctorLicenseNumber !== undefined && doctorLicenseNumber !== null) {
        queryBuilder = queryBuilder.andWhere(
          'Doctor.licenseNumber = :doctorLicenseNumber',
          { doctorLicenseNumber },
        );
      } else if (doctorLicenseNumber === null) {
        queryBuilder = queryBuilder.andWhere('Doctor.id IS NULL');
      }
      //OBRA SOCIAL
      if (medicalInsurance) {
        queryBuilder = queryBuilder.andWhere(
          'Patient.medicalInsurance = :medicalInsurance',
          { medicalInsurance },
        );
      }

      //ESPCIALIDAD DOCTOR
      if (doctorSpeciality) {
        queryBuilder = queryBuilder.andWhere(
          'Doctor.speciality LIKE :speciality',
          { speciality: `%${doctorSpeciality}%` },
        );
      }
      //ENFERMEDAD
      if (diseaseName) {
        console.log(diseaseName);
        queryBuilder = queryBuilder.andWhere('Disease.name LIKE :name', {
          name: `%${diseaseName}%`,
        });
      }

      const medicalEntries: MedicalEntry[] = await queryBuilder.getMany();

      medicalEntries.forEach((medicalEntry) => {
        if (medicalEntry.Practices && medicalEntry.Practices.length === 0) {
          delete medicalEntry.Practices;
        }
        if (
          medicalEntry.MedicalConsultations &&
          medicalEntry.MedicalConsultations.length === 0
        ) {
          delete medicalEntry.MedicalConsultations;
        }
        if (
          medicalEntry.medicalHistory &&
          medicalEntry.medicalHistory.patient
        ) {
          medicalEntry['Patient'] = medicalEntry.medicalHistory.patient;
          delete medicalEntry.medicalHistory;
        }
      });

      return medicalEntries;
    } catch (error) {
      throw new HttpException(
        'Failed to find medical entries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneMedicalEntry(id: number): Promise<MedicalEntry> {
    try {
      const medicalEntry: MedicalEntry = await this.medicalEntryRepository
        .createQueryBuilder('medicalEntry')
        .leftJoinAndSelect('medicalEntry.Doctor', 'Doctor')
        .leftJoinAndSelect('medicalEntry.Practices', 'Practices')
        .leftJoinAndSelect(
          'medicalEntry.MedicalConsultations',
          'MedicalConsultations',
        )
        .leftJoinAndSelect('MedicalConsultations.Disease', 'Disease')
        .where('medicalEntry.id = :id', { id })
        .getOne();

      if (!medicalEntry) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (medicalEntry.Practices && medicalEntry.Practices.length === 0) {
        delete medicalEntry.Practices;
      }

      if (
        medicalEntry.MedicalConsultations &&
        medicalEntry.MedicalConsultations.length === 0
      ) {
        delete medicalEntry.MedicalConsultations;
      }

      return medicalEntry;
    } catch (error) {
      throw new HttpException(
        'Failed to find medical entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async update(
    id: number,
    body: UpdateMedicalEntryDto,
  ): Promise<UpdateResult> {
    try {
      const { medicalHistoryId, doctorId } = body;
      const medicalEntry = await this.medicalEntryRepository.findOne({
        where: { id: medicalHistoryId },
      });
      const doctor = await this.doctorRepository.findOne({
        where: { id: doctorId },
      });

      if (!medicalEntry) {
        throw new Error('Medical entry not found');
      }

      if (!doctor) {
        throw new Error('Doctor not found');
      }

      return await this.medicalEntryRepository.update(id, { Doctor: doctor });
    } catch (error) {
      throw new HttpException(
        'Failed to update medical entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async remove(id: number): Promise<DeleteResult> {
    try {
      const medicalEntry: DeleteResult =
        await this.medicalEntryRepository.delete(id);
      if (medicalEntry.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return medicalEntry;
    } catch (error) {
      throw new HttpException(
        'Failed to delete medical entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
