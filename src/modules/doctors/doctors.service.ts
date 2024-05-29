import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctor(body: CreateDoctorDto): Promise<Doctor> {
    const newDoctor = this.doctorRepository.create(body);

    try {
      const savedDoctor = await this.doctorRepository.save(newDoctor);

      if (!savedDoctor) {
        throw new Error('Failed to find result');
      }

      return savedDoctor;
    } catch (error) {
      throw new HttpException('Failed to create patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAllDoctors(): Promise<Doctor[]> {
    try {
      const doctors: Doctor[] = await this.doctorRepository.find();

      if (doctors.length === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }

      return doctors;

    } catch (error) {
      throw new HttpException('Failed to find patients', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findOneDoctor(id: number): Promise<Doctor> {
    try {
      const doctor: Doctor = await this.doctorRepository.findOne(
        {
          where: { id },
        }
      );
      if (!doctor) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return doctor;
    } catch (error) {
      throw new HttpException('Failed to find doctors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateDoctor(
    id: number,
    body: UpdateDoctorDto,
  ): Promise<UpdateResult> {
    try {
      const doctor: UpdateResult = await this.doctorRepository.update(
        id,
        body,
      );

      if (doctor.affected === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }

      return doctor;
    } catch (error) {
      throw new HttpException('Failed to update patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async removeDoctor(id: number): Promise<DeleteResult> {
    try {
      const doctor: DeleteResult = await this.doctorRepository.delete(id);
      
      if (doctor.affected === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }

      return doctor;
    } catch (error) {
      throw new HttpException('Failed to delete patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
