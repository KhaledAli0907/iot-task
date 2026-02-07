import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { CreateReadingDto } from './dto/create-reading.entity';
import { PaginationQueryDto } from './dto/pagination.dto';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  create(@Body() data: CreateReadingDto) {
    return this.readingsService.create(data);
  }

  @Get('latest')
  getLatest() {
    return this.readingsService.getLatest();
  }

  @Get()
  getAll(@Query() query: PaginationQueryDto) {
    return this.readingsService.getAll(query);
  }

  @Get('sensor/:sensor')
  getBySensor(@Param('sensor') sensor: string) {
    return this.readingsService.getBySensor(sensor);
  }
}
