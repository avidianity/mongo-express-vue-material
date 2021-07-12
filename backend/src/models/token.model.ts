import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base } from './base.model';
import { UserClass } from './user.model';

export class TokenClass extends Base {
	@prop()
	key: string;

	@prop()
	hash: string;

	@prop({ ref: () => UserClass })
	user?: Ref<UserClass>;
}

export const Token = getModelForClass(TokenClass);
