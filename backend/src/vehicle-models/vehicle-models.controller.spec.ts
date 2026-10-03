import { Test, TestingModule } from '@nestjs/testing';
import { VehicleModelsController } from './vehicle-models.controller.js';

describe('VehicleModelsController', () => {
  let controller: VehicleModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleModelsController],
    }).compile();

    controller = module.get<VehicleModelsController>(VehicleModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
