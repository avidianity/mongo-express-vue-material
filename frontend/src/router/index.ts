import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';

import Orders from '@/components/Orders.vue';
import Order from '@/components/forms/Order.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		redirect: '/login',
	},
	{
		path: '/login',
		component: Login,
	},
	{
		path: '/register',
		component: Register,
	},
	{
		path: '/rider',
		component: Home,
		children: [
			{
				path: 'orders',
				component: Orders,
			},
			{
				path: 'orders/add',
				component: Order,
			},
			{
				path: 'orders/:id/edit',
				component: Order,
			},
		],
	},
	{
		path: '/customer',
		component: Home,
		children: [
			{
				path: 'orders',
				component: Orders,
			},
			{
				path: 'orders/add',
				component: Order,
			},
			{
				path: 'orders/:id/edit',
				component: Order,
			},
		],
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
