import { DocumentType } from '@typegoose/typegoose';
import { TokenClass } from './models/token.model';
import { UserClass } from './models/user.model';

declare global {
	namespace Express {
		export interface Request {
			token?: DocumentType<TokenClass>;
		}

		export interface User extends DocumentType<UserClass> {}
	}
}

export {};
