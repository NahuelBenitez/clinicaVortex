import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Practice } from './entities/practice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalHistory } from '../medical_histories/entities/medical_history.entity';
import { MedicalEntry } from '../medical_entries/entities/medical_entry.entity';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(Practice)
    private readonly practiceRepository: Repository<Practice>,
    @InjectRepository(MedicalEntry)
    private readonly medicalEntryRepository: Repository<MedicalEntry>,
  ) {}

  public async createPractice(body: CreatePracticeDto): Promise<Practice> {
    const { medicalEntryId } = body;
    const medicalEntry = await this.medicalEntryRepository.findOne({
      where: { id: medicalEntryId },
    });

    if (!medicalEntry) {
      throw new HttpException('Medical entry not found', HttpStatus.NOT_FOUND);
    }

    const existingConsultations = await this.medicalEntryRepository
      .createQueryBuilder('medicalEntry')
      .innerJoin('medicalEntry.MedicalConsultations', 'consultation')
      .where('medicalEntry.id = :id', { id: medicalEntryId })
      .getCount();

    if (existingConsultations > 0) {
      throw new HttpException(
        'A MedicalConsultation already exists for this medical entry',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPractice = this.practiceRepository.create({
      ...body,
      MedicalEntry: medicalEntry,
    });

    try {
      const savedPractice = await this.practiceRepository.save(newPractice);

      if (!savedPractice) {
        throw new Error('Failed to find result');
      }

      return savedPractice;
    } catch (error) {
      throw new HttpException(
        'Failed to create practice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAllPractices(): Promise<Practice[]> {
    try {
      const practice: Practice[] = await this.practiceRepository.find();
      if (practice.length === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return practice;
    } catch (error) {
      throw new HttpException(
        'Failed to find practices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOnePractice(id: number): Promise<Practice> {
    try {
      const practice: Practice = await this.practiceRepository.findOne({
        where: [{ id }],
      });
      if (!practice) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return practice;
    } catch (error) {
      throw new HttpException(
        'Failed to find practice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updatePractice(
    id: number,
    body: UpdatePracticeDto,
  ): Promise<UpdateResult> {
    try {
      const practice: UpdateResult = await this.practiceRepository.update(
        id,
        body,
      );
      if (practice.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return practice;
    } catch (error) {
      throw new HttpException(
        'Failed to update practice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async removePractice(id: number): Promise<DeleteResult> {
    try {
      const practice: DeleteResult = await this.practiceRepository.delete(id);
      if (practice.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return practice;
    } catch (error) {
      throw new HttpException(
        'Failed to delete practice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
