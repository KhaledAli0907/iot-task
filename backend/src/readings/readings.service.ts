import { Injectable } from '@nestjs/common';
import { ReadingsRepository } from './readings.repository';
import { CreateReadingDto } from './dto/create-reading.entity';

@Injectable()
export class ReadingsService {
  constructor(private readonly readingsRepository: ReadingsRepository) {}

  create(data: CreateReadingDto) {
    return this.readingsRepository.create(data);
  }

  getLatest() {
    return this.readingsRepository.findLatest();
  }

  getAll() {
    return this.readingsRepository.findAll();
  }

  getBySensor(sensor: string) {
    return this.readingsRepository.findBySensor(sensor);
  }
}
