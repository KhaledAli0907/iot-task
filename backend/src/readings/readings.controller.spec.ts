import { Test, TestingModule } from '@nestjs/testing';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { CreateReadingDto } from './dto/create-reading.entity';
import { Reading } from './entities/reading.entity';

describe('ReadingsController', () => {
  let controller: ReadingsController;
  let service: jest.Mocked<ReadingsService>;

  const mockReading: Reading = {
    id: 1,
    sensor: 'temperature',
    value: 25.5,
    createdAt: new Date('2026-02-05T12:00:00Z'),
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      getLatest: jest.fn(),
      getAll: jest.fn(),
      getBySensor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingsController],
      providers: [
        { provide: ReadingsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ReadingsController>(ReadingsController);
    service = module.get(ReadingsService) as jest.Mocked<ReadingsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with body and return created reading', async () => {
      const dto: CreateReadingDto = { sensor: 'temperature', value: 26 };
      const created = { ...mockReading, ...dto } as Reading;
      service.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('getLatest', () => {
    it('should return latest reading from service', async () => {
      service.getLatest.mockResolvedValue(mockReading);

      const result = await controller.getLatest();

      expect(service.getLatest).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReading);
    });

    it('should return null when no reading exists', async () => {
      service.getLatest.mockResolvedValue(null);

      const result = await controller.getLatest();

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should call service.getAll with query and return paginated result', async () => {
      const paginated = {
        items: [mockReading],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      service.getAll.mockResolvedValue(paginated);

      const result = await controller.getAll({ page: 1, limit: 10 });

      expect(service.getAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toEqual(paginated);
    });
  });

  describe('getBySensor', () => {
    it('should call service.getBySensor with param and return readings', async () => {
      const readings = [mockReading];
      service.getBySensor.mockResolvedValue(readings);

      const result = await controller.getBySensor('temperature');

      expect(service.getBySensor).toHaveBeenCalledWith('temperature');
      expect(result).toEqual(readings);
    });
  });
});
