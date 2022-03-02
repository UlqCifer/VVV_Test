import { Injectable, Logger } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { MessageEntity, MessagePeristedEntity } from './entities/message.entity';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
	constructor(
		private readonly repository: AppRepository,
		private readonly redis: RedisService,
		private readonly logger: Logger
	) {}

	async saveMessage(request: MessageEntity): Promise<number> {
		try {
			const { id } = await this.repository.saveMessage(request);
			await this.redis.save(id.toString(), { ...request, id });
			return id;
		} catch (error) {
			this.logger.error(
				`Неудалось сохранить сообщение: ${JSON.stringify(request)}. По причине: ${JSON.stringify(error)}`
			);
			throw new Error(error);
		}
	}

	async getMessage(id: number): Promise<MessagePeristedEntity | null> {
		try {
			const redisCache = await this.redis.get<MessagePeristedEntity>(id.toString());
			if (!redisCache) {
				const message = await this.repository.getMessageById(id);
				await this.redis.save(id.toString(), message);
				return message;
			} else {
				return redisCache;
			}
		} catch (error) {
			this.logger.error(`Неудалось получить сообщение: ${id}. По причине: ${JSON.stringify(error)}`);
			throw new Error(error);
		}
	}

	async deleteMessage(id: number): Promise<number> {
		try {
			await this.redis.delete(id.toString());
			await this.repository.deleteMessage(id);
			return id;
		} catch (error) {
			this.logger.error(`Неудалось удалить сообщение: ${id}. По причине: ${JSON.stringify(error)}`);
			throw new Error(error);
		}
	}
}
