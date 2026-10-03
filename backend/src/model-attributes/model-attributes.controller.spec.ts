import { Test, TestingModule } from '@nestjs/testing';
import { ModelAttributesController } from './model-attributes.controller.js';

describe('ModelAttributesController', () => {
  let controller: ModelAttributesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelAttributesController],
    }).compile();

    controller = module.get<ModelAttributesController>(ModelAttributesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
