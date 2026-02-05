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

  findLatest() {
    return this.repo.findOne({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findAll() {
    return this.repo.find();
  }

  findBySensor(sensor: string) {
    return this.repo.find({
      where: { sensor },
    });
  }
}
