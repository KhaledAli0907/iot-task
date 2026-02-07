import { Injectable } from '@nestjs/common';
import { Reading } from './entities/reading.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReadingsRepository {
  constructor(
    @InjectRepository(Reading)
    private readonly repo: Repository<Reading>,
  ) {}

  create(data: Partial<Reading>) {
    return this.repo.save(data);
  }

  async findLatest(): Promise<Reading | null> {
    const results = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return results[0] ?? null;
  }

  async findAll(): Promise<Reading[]> {
    return await this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ items: Reading[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { items, total };
  }

  findBySensor(sensor: string) {
    return this.repo.find({
      where: { sensor },
    });
  }
}
