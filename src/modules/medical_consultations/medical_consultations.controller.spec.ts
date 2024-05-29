import { Test, TestingModule } from '@nestjs/testing';
import { MedicalConsultationsController } from './medical_consultations.controller';
import { MedicalConsultationsService } from './medical_consultations.service';

describe('MedicalConsultationsController', () => {
  let controller: MedicalConsultationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalConsultationsController],
      providers: [MedicalConsultationsService],
    }).compile();

    controller = module.get<MedicalConsultationsController>(MedicalConsultationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
