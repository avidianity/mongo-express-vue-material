import { UserContract } from '@/contracts/user.contract';
import { Service } from '@/libraries/Service';
import axios from 'axios';

export class UserService extends Service<UserContract> {
	async login(payload: any) {
		try {
			const { data } = await axios.post<{ user: UserContract; token: string }>('/auth/login', payload);
			return data;
		} catch (error) {
			throw error;
		}
	}

	async register(payload: any) {
		try {
			const { data } = await axios.post<{ user: UserContract; token: string }>('/auth/register', payload);
			return data;
		} catch (error) {
			throw error;
		}
	}
}

export const userService = new UserService('/users');
