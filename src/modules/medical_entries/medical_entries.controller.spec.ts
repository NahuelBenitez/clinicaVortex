import { Test, TestingModule } from '@nestjs/testing';
import { MedicalEntriesController } from './medical_entries.controller';
import { MedicalEntriesService } from './medical_entries.service';

describe('MedicalEntriesController', () => {
  let controller: MedicalEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalEntriesController],
      providers: [MedicalEntriesService],
    }).compile();

    controller = module.get<MedicalEntriesController>(MedicalEntriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
