import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from './base.model';
import { OrderClass } from './order.model';

export class UserClass extends Base {
	@prop()
	name: string;

	@prop()
	email: string;

	@prop()
	password: string;

	@prop()
	role: string;

	orders?: OrderClass[];
}

export const User = getModelForClass(UserClass);
