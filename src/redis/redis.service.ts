import { Inject, Injectable } from '@nestjs/common';
import { IRedisConfig } from '../configs/redis.config';
import { REDIS_CONFIG } from './redis.constants';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	private readonly client: Redis.Redis;
	constructor(@Inject(REDIS_CONFIG) private config: IRedisConfig) {
		this.client = new Redis(this.config.port, this.config.host);
	}

	public async save<T>(key: string, value: T): Promise<'OK'> {
		return this.client.set(key, JSON.stringify(value), 'ex', this.config.cacheLifeTime);
	}

	public async get<T>(key: string): Promise<T | null> {
		const data = await this.client.get(key);
		if (!data) {
			return null;
		}
		return JSON.parse(data) as T;
	}

	public async delete(key: string): Promise<number> {
		return this.client.del(key);
	}
}
