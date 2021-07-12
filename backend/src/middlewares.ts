import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
	if (error instanceof Error) {
		error = error.toObject();
	}
	console.error(error);
	return res.status(error.status || 500).json(error);
}

export function authenticate() {
	return passport.authenticate('bearer', { session: false });
}
