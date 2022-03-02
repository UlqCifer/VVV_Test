export class MessageEntity {
	id?: number;
	text: string;
	title: string;
	target: string;
	system: string;
}

export class MessagePeristedEntity extends MessageEntity {
	id: number;
}
