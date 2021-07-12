import { Request, Response, Router } from 'express';
import { authenticate } from '../middlewares';
import 'express-async-errors';
import { Order, OrderClass } from '../models/order.model';
import { body, param } from 'express-validator';
import { validate, Validation } from '../helpers';
import { BadRequestException } from '../exceptions/BadRequestException';
import { DocumentType } from '@typegoose/typegoose';
import { NotFoundException } from '../exceptions/NotFoundException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

const findOrder = async (req: Request) => {
	let order: DocumentType<OrderClass> | null;

	if (req.user!.role === 'Rider') {
		order = await Order.findById(req.params.id).populate('user').exec();
	} else {
		order = await Order.findOne({ _id: req.params.id, user: req.user!._id }).populate('user').exec();
	}

	if (!order) {
		throw new NotFoundException('Order does not exist.');
	}

	return order;
};

const router = Router();

router.use(authenticate());

router.get('/', async (req, res) => {
	if (req.user!.role === 'Rider') {
		return res.json((await Order.find().populate('user').exec()).reverse());
	} else {
		return res.json((await Order.find({ user: req.user!._id }).populate('user').exec()).reverse());
	}
});

router.get(
	'/:id',
	[param('id').isMongoId().bail().custom(Validation.exists(Order, '_id')), validate()],
	async (req: Request, res: Response) => {
		return res.json(await findOrder(req));
	}
);

router.post(
	'/',
	[body('details').isString().bail().notEmpty(), body('amount').isNumeric(), validate()],
	async (req: Request, res: Response) => {
		if (req.user!.role !== 'Customer') {
			throw new BadRequestException('Riders cannot create an order.');
		}
		const { details, amount } = req.body;

		return res.status(201).json(
			await Order.create({
				details,
				amount,
				delivered: false,
				status: 'Pending',
				user: req.user!._id,
			})
		);
	}
);

function update() {
	return [
		body('delivered').isBoolean().optional(),
		body('status').isString().bail().notEmpty().optional(),
		param('id').isMongoId().bail().custom(Validation.exists(Order, '_id', 'Order does not exist.')),
		validate(),
		async (req: Request, res: Response) => {
			if (req.user!.role !== 'Rider') {
				throw new UnauthorizedException('Customer cannot update order.');
			}

			const order = (await Order.findById(req.params.id))!;

			const { delivered, status } = req.body;

			return res.json(await order.update({ delivered, status }).exec());
		},
	];
}

router.put('/:id', update());
router.patch('/:id', update());

router.delete('/:id', [param('id').isMongoId(), validate()], async (req: Request, res: Response) => {
	const order = await findOrder(req);

	await order.remove();

	return res.sendStatus(204);
});

export const orders = router;
