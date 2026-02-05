import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { CreateReadingDto } from './dto/create-reading.entity';

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
    getAll() {
        return this.readingsService.getAll();
    }

    @Get('sensor/:sensor')
    getBySensor(@Param('sensor') sensor: string) {
        return this.readingsService.getBySensor(sensor);
    }
}
