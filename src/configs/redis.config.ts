import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (configService: ConfigService): IRedisConfig => ({
	host: getConfigService<string>(configService, 'REDIS_HOST'),
	port: getConfigService<number>(configService, 'REDIS_PORT'),
	cacheKeyPrefix: getConfigService<string>(configService, 'REDIS_KEY_PREFIX'),
	cacheLifeTime: getConfigService<number>(configService, 'REDIS_CACHE_LIFETIME_IN_SECONDS'),
});

function getConfigService<T>(configService: ConfigService, configName: string): T {
	const logger = new Logger('redis_config');
	const configValue = configService.get<T>(configName);
	if (!configValue) {
		logger.error(`Неудалось получить значение .env настроек: ${configName}`);
		throw new Error(`Неудалось получить значение .env настроек: ${configName}`);
	}
	return configValue;
}

export interface IRedisConfig {
	host: string;
	port: number;
	cacheKeyPrefix: string;
	cacheLifeTime: number;
}
