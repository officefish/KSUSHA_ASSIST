import { Module } from '@nestjs/common';
import { CubesController } from './cubes.controller';
import { CubesService } from './cubes.service';

@Module({
  controllers: [CubesController],
  providers: [CubesService],
  exports: [CubesService],
})
export class CubesModule {}
