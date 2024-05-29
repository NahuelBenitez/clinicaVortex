import { Test, TestingModule } from '@nestjs/testing';
import { MedicalConsultationsService } from './medical_consultations.service';

describe('MedicalConsultationsService', () => {
  let service: MedicalConsultationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalConsultationsService],
    }).compile();

    service = module.get<MedicalConsultationsService>(MedicalConsultationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
