import { Test, TestingModule } from '@nestjs/testing';
import { MedicalEntriesService } from './medical_entries.service';

describe('MedicalEntriesService', () => {
  let service: MedicalEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalEntriesService],
    }).compile();

    service = module.get<MedicalEntriesService>(MedicalEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
