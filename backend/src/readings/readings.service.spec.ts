import { Test, TestingModule } from '@nestjs/testing';
import { ReadingsService } from './readings.service';
import { ReadingsRepository } from './readings.repository';
import { CreateReadingDto } from './dto/create-reading.entity';
import { Reading } from './entities/reading.entity';

describe('ReadingsService', () => {
  let service: ReadingsService;
  let repository: jest.Mocked<ReadingsRepository>;

  const mockReading: Reading = {
    id: 1,
    sensor: 'temperature',
    value: 25.5,
    createdAt: new Date('2026-02-05T12:00:00Z'),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findLatest: jest.fn(),
      findPaginated: jest.fn(),
      findBySensor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingsService,
        { provide: ReadingsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ReadingsService>(ReadingsService);
    repository = module.get(ReadingsRepository) as jest.Mocked<ReadingsRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create with DTO and return the created reading', async () => {
      const dto: CreateReadingDto = { sensor: 'temperature', value: 26 };
      repository.create.mockResolvedValue({ ...mockReading, ...dto } as Reading);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ ...mockReading, ...dto });
    });
  });

  describe('getLatest', () => {
    it('should return the latest reading from repository', async () => {
      repository.findLatest.mockResolvedValue(mockReading);

      const result = await service.getLatest();

      expect(repository.findLatest).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReading);
    });

    it('should return null when repository returns null', async () => {
      repository.findLatest.mockResolvedValue(null);

      const result = await service.getLatest();

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return paginated result with default page and limit', async () => {
      const items = [mockReading];
      const total = 1;
      repository.findPaginated.mockResolvedValue({ items, total });

      const result = await service.getAll({});

      expect(repository.findPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        items,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should pass page and limit to repository and compute totalPages', async () => {
      const items = [mockReading];
      const total = 25;
      repository.findPaginated.mockResolvedValue({ items, total });

      const result = await service.getAll({ page: 2, limit: 10 });

      expect(repository.findPaginated).toHaveBeenCalledWith(2, 10);
      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
    });
  });

  describe('getBySensor', () => {
    it('should call repository.findBySensor and return readings', async () => {
      const sensorReadings = [mockReading];
      repository.findBySensor.mockResolvedValue(sensorReadings as Reading[]);

      const result = await service.getBySensor('temperature');

      expect(repository.findBySensor).toHaveBeenCalledWith('temperature');
      expect(result).toEqual(sensorReadings);
    });
  });
});
