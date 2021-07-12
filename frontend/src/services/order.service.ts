import { OrderContract } from '@/contracts/order.contract';
import { Service } from '@/libraries/Service';

export class OrderService extends Service<OrderContract> {}

export const orderService = new OrderService('/orders');
