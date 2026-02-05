import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [DatabaseModule, ReadingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
