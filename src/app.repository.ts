import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MessageEntity, MessagePeristedEntity } from './entities/message.entity';

@Injectable()
export class AppRepository {
	constructor(private readonly prismaClient: PrismaClient) {}

	async saveMessage(message: MessageEntity): Promise<MessagePeristedEntity> {
		if (!message.id) {
			return this.createMessage(message);
		} else {
			return this.updateMessage(message);
		}
	}

	private async createMessage(message: MessageEntity): Promise<MessagePeristedEntity> {
		return this.prismaClient.messages.create({ data: message });
	}

	private async updateMessage(message: MessageEntity): Promise<MessagePeristedEntity> {
		return this.prismaClient.messages.update({ where: { id: message.id }, data: message });
	}

	async getMessageById(id: number): Promise<MessagePeristedEntity> {
		return this.prismaClient.messages.findUnique({ where: { id } });
	}

	async deleteMessage(id: number): Promise<MessagePeristedEntity> {
		return this.prismaClient.messages.delete({ where: { id } });
	}
}
