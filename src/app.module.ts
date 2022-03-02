import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule],
	controllers: [AppController],
	providers: [AppService, AppRepository, PrismaClient, Logger],
})
export class AppModule {}
