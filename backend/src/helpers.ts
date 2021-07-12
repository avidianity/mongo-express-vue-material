import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { ValidationException } from './exceptions/ValidationException';
import { hashSync, compareSync } from 'bcrypt';
import { capitalize } from 'lodash';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types';

export function validate() {
	return (req: Request, _res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return next(new ValidationException(errors.array()));
		}

		const body = matchedData(req, { locations: ['body'] });
		req.body = { ...body };

		const query = matchedData(req, { locations: ['query'] });
		req.query = { ...query };

		const params = matchedData(req, { locations: ['params'] });
		req.params = { ...params };

		return next();
	};
}

export namespace Hash {
	export function make(data: any) {
		return hashSync(data, 8);
	}

	export function check(data: any, hashed: string) {
		return compareSync(data, hashed);
	}
}

export namespace Validation {
	export function unique<T extends AnyParamConstructor<any>>(model: ReturnModelType<T, BeAnObject>, key: string, message?: string) {
		return async (value: any) => {
			try {
				const exists = await model
					.findOne({
						[key]: value,
					} as any)
					.exec();
				if (exists) {
					return Promise.reject(message ? message : `${capitalize(key)} is already taken.`);
				}
				return true;
			} catch (error) {
				console.error(error);
				return Promise.reject(`Unable to verify ${key}.`);
			}
		};
	}

	export function exists<T extends AnyParamConstructor<any>>(model: ReturnModelType<T, BeAnObject>, key: string, message?: string) {
		return async (value: any) => {
			try {
				const exists = await model.findOne({
					[key]: value,
				} as any);
				if (!exists) {
					return Promise.reject(message ? message : `${capitalize(key as any)} does not exist.`);
				}
				return true;
			} catch (error) {
				console.error(error);
				return Promise.reject(`Unable to verify ${key}.`);
			}
		};
	}
}

export function getMongoose(req: Request) {
	return req.app.get('mongoose') as typeof import('mongoose');
}
