import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('ApplicationController', () => {
  let controller: ApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
