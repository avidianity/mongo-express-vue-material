import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import 'express-async-errors';
import { Hash, validate, Validation } from '../helpers';
import md5 from 'md5';
import { NotFoundException } from '../exceptions/NotFoundException';
import { BadRequestException } from '../exceptions/BadRequestException';
import dayjs from 'dayjs';
import { authenticate } from '../middlewares';
import { User } from '../models/user.model';
import { Token } from '../models/token.model';

const router = Router();

router.post(
	'/register',
	[
		body('name').isString().bail().notEmpty(),
		body('email').isEmail().bail().custom(Validation.unique(User, 'email')),
		body('password').isString().bail().notEmpty(),
		body('role').isString().bail().notEmpty().bail().isIn(['Rider', 'Customer']),
		validate(),
	],
	async (req: Request, res: Response) => {
		const { name, email, password, role } = req.body;

		const hash = String.random(30);
		const key = String.random(5);

		const user = await User.create({
			name,
			email,
			password: Hash.make(password),
			role,
		});

		await Token.create({
			hash: md5(hash),
			key: md5(key),
			user: user._id,
		});

		return res
			.cookie('key', key, { httpOnly: true, expires: dayjs().add(1, 'month').toDate() })
			.json({ user: user.except(['password']), token: hash });
	}
);

router.post(
	'/login',
	[body('email').isEmail(), body('password').isString().bail().notEmpty(), validate()],
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const user = await User.findOne({
			email,
		}).exec();

		if (!user) {
			throw new NotFoundException('Email does not exist.');
		}

		if (!Hash.check(password, user.password)) {
			throw new BadRequestException('Password is incorrect.');
		}

		const hash = String.random(30);
		const key = String.random(5);

		await Token.create({
			user: user._id,
			hash: md5(hash),
			key: md5(key),
		});

		return res
			.cookie('key', key, { httpOnly: true, expires: dayjs().add(1, 'month').toDate() })
			.json({ user: user.except(['password']), token: hash });
	}
);

router.post(
	'/update',
	[
		body('name').isString().bail().notEmpty().optional(),
		body('email').isEmail().optional(),
		body('password').isString().bail().notEmpty().optional(),
		validate(),
	],
	async (req: Request, res: Response) => {
		const { name, email, password } = req.body;

		if (email) {
			const exist = await User.findOne({
				email,
				_id: {
					$not: {
						$eq: req.user?._id,
					},
				},
			});

			if (exist) {
				throw new BadRequestException('Email already exists.');
			}
		}

		const data = {
			name,
			email,
			password: password ? Hash.make(password) : undefined,
		};

		return res.json(await req.user!.update(data).exec());
	}
);

router.get('/check', authenticate(), (req, res) => res.json(req.user?.except(['password'])));

router.get('/logout', authenticate(), async (req, res) => {
	const token = await Token.findOne(req.token?._id);

	if (token) {
		await token.remove();
	}

	return res.clearCookie('key').sendStatus(204);
});

export const auth = router;
