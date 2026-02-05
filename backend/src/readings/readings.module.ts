import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { ReadingsRepository } from './readings.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reading } from './entities/reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reading])],
  controllers: [ReadingsController],
  providers: [ReadingsService, ReadingsRepository]
})
export class ReadingsModule {}
