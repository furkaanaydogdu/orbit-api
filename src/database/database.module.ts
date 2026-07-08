import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Global() // makes PrismaService injectable everywhere without re-importing this module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
