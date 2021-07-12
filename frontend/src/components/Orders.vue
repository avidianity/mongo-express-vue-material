<template>
	<div class="container">
		<div class="button-container" v-if="user.role === 'Customer'">
			<md-button class="md-icon-button md-primary md-raised left" @click.prevent="add">
				<md-icon>add</md-icon>
			</md-button>
		</div>
		<div class="orders">
			<md-card v-for="(order, index) in orders" :key="index">
				<md-card-header>
					<md-card-header-text>
						<div class="md-title">{{ getName(order) }}</div>
						<div class="md-subhead">{{ getDate(order) }}</div>
						<div class="md-subhead">Delivered: {{ order.delivered ? 'Yes' : 'No' }}</div>
						<div class="md-subhead">Amount: {{ getAmount(order) }}</div>
					</md-card-header-text>

					<md-menu md-size="big" md-direction="bottom-end" v-if="!order.delivered && user.role === 'Rider'">
						<md-button class="md-icon-button" md-menu-trigger>
							<md-icon>more_vert</md-icon>
						</md-button>

						<md-menu-content>
							<router-link :to="`/${user.role.toLowerCase()}/orders/${order._id}/edit`">
								<md-menu-item>
									<span>Update</span>
									<md-icon>edit</md-icon>
								</md-menu-item>
							</router-link>
						</md-menu-content>
					</md-menu>
				</md-card-header>

				<md-card-content>
					<p>
						{{ order.details }}
					</p>
					<small> Status: {{ order.status }} </small>
				</md-card-content>
			</md-card>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { OrderContract } from '@/contracts/order.contract';
import { orderService } from '@/services/order.service';
import { formatCurrency, handleError } from '@/helpers';
import dayjs from 'dayjs';
import { State } from '@/libraries/State';
import { UserContract } from '@/contracts/user.contract';

@Component
export default class Orders extends Vue {
	orders: OrderContract[] = [];

	state = State.getInstance();

	user = this.state.get<UserContract>('user')!;

	async created() {
		try {
			this.orders = await orderService.fetch();
		} catch (error) {
			handleError(error);
		}
	}

	getDate(order: OrderContract) {
		return dayjs(order.createdAt).format('MMMM DD, YYYY hh:mm A');
	}

	getAmount(order: OrderContract) {
		return formatCurrency(order.amount);
	}

	getName(order: OrderContract) {
		return order.user?.name || '';
	}

	add() {
		this.$router.push(`/${this.user.role.toLowerCase()}/orders/add`);
	}
}
</script>

<style scoped lang="scss">
.container {
	padding-left: 0.5rem;
	padding-right: 0.5rem;
}

.button-container {
	display: flex;

	.md-button {
		display: inline;
	}

	.left {
		margin-right: auto;
	}

	.right {
		margin-left: auto;
	}
}

.orders {
	margin-top: 4rem;
}

.md-card {
	margin-top: 1rem;
}
</style>
