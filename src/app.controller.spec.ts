import { INestApplication, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { MessageEntity } from './entities/message.entity';
import { RedisModule } from './redis/redis.module';

jest.setTimeout(50000);
const testMessage: MessageEntity = {
	text: 'Test text',
	title: 'Test title',
	target: 'Test target',
	system: 'Test system',
};

let testMessageId: number;

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

describe('AppController', () => {
	let app: INestApplication;
	let appController: AppController;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule],
			controllers: [AppController],
			providers: [AppService, AppRepository, PrismaClient, Logger],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
		appController = app.get<AppController>(AppController);
	});

	it('Save message', async () => {
		testMessageId = await appController.saveMessage(testMessage);
		expect(testMessageId).toBeDefined();
	});

	it('Get message', async () => {
		const message = await appController.getMessage(testMessageId);
		expect(message).toEqual({ ...testMessage, id: testMessageId });
	});

	it('Delete message', async () => {
		const message = await appController.deleteMessage(testMessageId);
		expect(message).toBe(testMessageId);
	});

	it('Get message after delete', async () => {
		const message = await appController.getMessage(testMessageId);
		expect(message).toBeNull();
	});

	afterEach(async () => {
		await app.close();
	});
});
