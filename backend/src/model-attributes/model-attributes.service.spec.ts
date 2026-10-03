import { Test, TestingModule } from '@nestjs/testing';
import { ModelAttributesService } from './model-attributes.service.js';

describe('ModelAttributesService', () => {
  let service: ModelAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelAttributesService],
    }).compile();

    service = module.get<ModelAttributesService>(ModelAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
