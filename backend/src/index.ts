import '@avidian/extras';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import md5 from 'md5';
import passport from 'passport';
import { Strategy, VerifyFunctionWithRequest } from 'passport-http-bearer';
import { connect } from './database';
import { errorHandler } from './middlewares';
import { Token } from './models/token.model';
import { auth } from './routes/auth';
import { orders } from './routes/orders';
import { users } from './routes/users';
import './shims';

async function main() {
	const app = express();

	app.use(urlencoded({ extended: true }));
	app.use(json());
	app.use(cookieParser(String.random(20)));
	app.use(cors({ credentials: true, origin: (origin, callback) => callback(null, origin) }));

	const mongoose = await connect();

	app.set('mongoose', mongoose);

	passport.use(
		new Strategy<VerifyFunctionWithRequest>(
			{
				passReqToCallback: true,
			},
			async (req, hash, done) => {
				try {
					const { key } = req.cookies;

					const token = await Token.findOne({
						hash: md5(hash),
					})
						.populate('user')
						.exec();

					if (!token || !key) {
						return done(null, false);
					}

					if (token.key !== md5(key)) {
						await Token.remove({ _id: token._id });
						return done(null, false);
					}

					req.token = token.except(['user']);

					return done(null, token.user, { scope: 'all' });
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	app.use(passport.initialize());

	app.use('/auth', auth);
	app.use('/users', users);
	app.use('/orders', orders);

	app.use(errorHandler);

	app.listen(process.env.PORT || 8000, () => console.log(`✨: Server running on ${process.env.PORT || 8000}`));
}

main().catch(console.error);
