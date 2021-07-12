import { BaseContract } from './base.contract';
import { UserContract } from './user.contract';

export interface OrderContract extends BaseContract {
	details: string;
	amount: number;
	delivered: boolean;
	status: string;
	user?: UserContract;
}
