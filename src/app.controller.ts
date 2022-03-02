import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageEntity, MessagePeristedEntity } from './entities/message.entity';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	async saveMessage(@Body() request: MessageEntity): Promise<number> {
		return this.appService.saveMessage(request);
	}

	@Get(':id')
	async getMessage(@Param('id') id: number): Promise<MessagePeristedEntity | null> {
		return this.appService.getMessage(id);
	}

	@Delete(':id')
	async deleteMessage(@Param('id') id: number): Promise<number> {
		return this.appService.deleteMessage(id);
	}
}
