import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypesController } from './vehicle-types.controller.js';

describe('VehicleTypesController', () => {
  let controller: VehicleTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleTypesController],
    }).compile();

    controller = module.get<VehicleTypesController>(VehicleTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
