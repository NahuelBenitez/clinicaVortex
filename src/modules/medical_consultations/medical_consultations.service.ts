import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicalConsultationDto } from './dto/create-medical_consultation.dto';
import { UpdateMedicalConsultationDto } from './dto/update-medical_consultation.dto';
import { MedicalConsultation } from './entities/medical_consultation.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalEntry } from '../medical_entries/entities/medical_entry.entity';

@Injectable()
export class MedicalConsultationsService {
  constructor(
    @InjectRepository(MedicalConsultation)
    private readonly medicalConsultationRepository: Repository<MedicalConsultation>,
    @InjectRepository(MedicalEntry)
    private readonly medicalEntryRepository: Repository<MedicalEntry>,
  ) {}

  public async createMedicalConsultation(body: CreateMedicalConsultationDto): Promise<MedicalConsultation> {
    const {medicalEntryId, diseaseId} = body;
    const medicalEntry = await this.medicalEntryRepository.findOne({ where: { id: medicalEntryId}});
    const disease = await this.medicalEntryRepository.findOne({ where: { id: diseaseId } });


    if (!medicalEntry || !disease) {
      throw new HttpException('Medical entry not found', HttpStatus.NOT_FOUND);
    }

    const existingPractices = await this.medicalEntryRepository
      .createQueryBuilder('medicalEntry')
      .innerJoin('medicalEntry.Practices', 'practice')
      .where('medicalEntry.id = :id', { id: medicalEntryId })
      .getCount();

    if (existingPractices > 0) {
      throw new HttpException('A Practice already exists for this medical entry', HttpStatus.BAD_REQUEST);
    }

    const newMedicalConsultation = this.medicalConsultationRepository.create({
      ...body,
      MedicalEntry: medicalEntry,
      Disease: disease
    })

    try {
      const savedMedicalConsultation = await this.medicalConsultationRepository.save(newMedicalConsultation);

      if (!savedMedicalConsultation) {
        throw new Error('No se encontró resultado');
      }

      return savedMedicalConsultation;
    } catch (error) {
      throw new HttpException('Failed to create medical consultation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAllMedicalConsultations(): Promise<MedicalConsultation[]> {
    try {
      const medicalConsultation: MedicalConsultation[] = await this.medicalConsultationRepository.find({
        relations: ['Disease']
      });
      if (medicalConsultation.length === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return medicalConsultation;
    } catch (error) {
      throw new HttpException('Failed to find medical consultations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findOneMedicalConsultation(id: number): Promise<MedicalConsultation> {
    try {
      const medicalConsultation: MedicalConsultation = await this.medicalConsultationRepository.findOne({
        where: [{id}],
        relations: ['Disease']
      })
      if (!medicalConsultation) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return medicalConsultation;
    } catch (error) {
      throw new HttpException('Failed to find medical consultation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateMedicalConsultation(
    id: number,
    body: UpdateMedicalConsultationDto,
  ): Promise<UpdateResult> {
    try {
      const medicalConsultation: UpdateResult = await this.medicalConsultationRepository.update(
        id,
        body,
      );
      if (medicalConsultation.affected === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return medicalConsultation;
    } catch (error) {
      throw new HttpException('Failed to update medical consultation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async removeMedicalConsultation(id: number): Promise<DeleteResult> {
    try {
      const medicalConsultation: DeleteResult = await this.medicalConsultationRepository.delete(id);
      if (medicalConsultation.affected === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return medicalConsultation;
    } catch (error) {
      throw new HttpException('Failed to delete medical consultation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
