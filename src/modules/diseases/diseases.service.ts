import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Disease } from './entities/disease.entity';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}

  public async createDisease(body: CreateDiseaseDto): Promise<Disease> {
    const newDisease = this.diseaseRepository.create(body);

    try {
      const savedDisease = await this.diseaseRepository.save(newDisease);

      if (!savedDisease) {
        throw new Error('Failed to find result');
      }

      return savedDisease;
    } catch (error) {
      throw new HttpException(
        'Failed to create disease',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAllDiseases(text?: string): Promise<Disease[]> {
    try {
      let queryOptions = {};

      if (text) {
        queryOptions = { where: { name: Like(`%${text}%`) } };
      }

      const diseases: Disease[] =
        await this.diseaseRepository.find(queryOptions);

      if (!text && diseases.length === 0) {
        throw new HttpException('No diseases found', HttpStatus.NOT_FOUND);
      }

      return diseases;
    } catch (error) {
      throw new HttpException(
        'Failed to find diseases',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOneDisease(id: number): Promise<Disease> {
    try {
      const disease: Disease = await this.diseaseRepository.findOne({
        where: [{ id }],
      });
      if (!disease) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return disease;
    } catch (error) {
      throw new HttpException(
        'Failed to find disease',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateDisease(
    id: number,
    body: UpdateDiseaseDto,
  ): Promise<UpdateResult> {
    try {
      const disease: UpdateResult = await this.diseaseRepository.update(
        id,
        body,
      );
      if (disease.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return disease;
    } catch (error) {
      throw new HttpException(
        'Failed to update disease',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async removeDisease(id: number): Promise<DeleteResult> {
    try {
      const disease: DeleteResult = await this.diseaseRepository.delete(id);
      if (disease.affected === 0) {
        throw new HttpException(
          'Failed to find result',
          HttpStatus.BAD_REQUEST,
        );
      }
      return disease;
    } catch (error) {
      throw new HttpException(
        'Failed to delete disease',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
