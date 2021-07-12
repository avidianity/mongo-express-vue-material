import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base } from './base.model';
import { UserClass } from './user.model';

export class OrderClass extends Base {
	@prop()
	details: string;

	@prop()
	amount: number;

	@prop()
	delivered: boolean;

	@prop()
	status: string;

	@prop({ ref: () => UserClass })
	user?: Ref<UserClass>;
}

export const Order = getModelForClass(OrderClass);
