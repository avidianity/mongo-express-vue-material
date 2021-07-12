import { pre, prop } from '@typegoose/typegoose';

@pre<Base>('save', function () {
	this.updatedAt = new Date();
})
export class Base {
	@prop({ default: new Date() })
	createdAt?: Date;

	@prop({ default: new Date() })
	updatedAt?: Date;
}
