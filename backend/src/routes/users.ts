import { Request, Response, Router } from 'express';
import { authenticate } from '../middlewares';
import 'express-async-errors';
import { User } from '../models/user.model';
import { param } from 'express-validator';
import { validate, Validation } from '../helpers';
import { Order } from '../models/order.model';
import '@avidian/extras';

const router = Router();

router.use(authenticate());

router.get('/', async (_, res) => {
	return res.json(
		(
			await Promise.all(
				(
					await User.find().populate('tokens').exec()
				).map(async (user) => {
					if (user.role === 'Customer') {
						user.orders = await Order.find({ user: user._id });
					}

					return user;
				})
			)
		).except(['password'])
	);
});

router.get(
	'/:id',
	[param('id').isMongoId().bail().custom(Validation.exists(User, '_id', 'User does not exist.')), validate()],
	async (req: Request, res: Response) => {
		const user = (await User.findById(req.params.id))!;

		if (user.role === 'Customer') {
			user.orders = await Order.find({ user: user._id });
		}

		return res.json(user);
	}
);

export const users = router;
