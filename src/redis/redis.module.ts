import { RedisService } from './redis.service';
import { Module } from '@nestjs/common';
import { REDIS_CONFIG } from './redis.constants';
import { ConfigService } from '@nestjs/config';
import { getRedisConfig } from '../configs/redis.config';

@Module({
	imports: [],
	controllers: [],
	providers: [
		RedisService,
		{
			provide: REDIS_CONFIG,
			useFactory: (configService: ConfigService) => getRedisConfig(configService),
			inject: [ConfigService],
		},
	],
	exports: [RedisService],
})
export class RedisModule {}
