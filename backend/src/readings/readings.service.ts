import { Injectable } from '@nestjs/common';
import { ReadingsRepository } from './readings.repository';
import { CreateReadingDto } from './dto/create-reading.entity';
import {
  type PaginatedResult,
  PaginationQueryDto,
} from './dto/pagination.dto';
import { Reading } from './entities/reading.entity';

@Injectable()
export class ReadingsService {
  constructor(private readonly readingsRepository: ReadingsRepository) {}

  create(data: CreateReadingDto) {
    return this.readingsRepository.create(data);
  }

  getLatest() {
    return this.readingsRepository.findLatest();
  }

  async getAll(query: PaginationQueryDto): Promise<PaginatedResult<Reading>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { items, total } = await this.readingsRepository.findPaginated(page, limit);
    const totalPages = Math.ceil(total / limit);
    return { items, total, page, limit, totalPages };
  }

  getBySensor(sensor: string) {
    return this.readingsRepository.findBySensor(sensor);
  }
}
