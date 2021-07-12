<template>
	<form novalidate class="md-layout form" @submit.prevent="submit">
		<md-card class="md-layout-item">
			<md-card-header>
				<div class="md-title">{{ mode }} Order</div>
				<div class="md-subtitle">Please fill in the form below.</div>
			</md-card-header>
			<md-card-content>
				<div class="lg-layout md-gutter">
					<div class="md-layout-item">
						<md-field>
							<label for="details">Details</label>
							<md-textarea
								name="details"
								id="details"
								v-model="data.details"
								:disabled="processing || user.role !== 'Customer'"
							/>
						</md-field>
					</div>
					<div class="md-layout-item">
						<md-field>
							<label for="amount">Amount</label>
							<md-input
								type="number"
								name="amount"
								id="amount"
								v-model="data.amount"
								:disabled="processing || user.role !== 'Customer'"
							/>
						</md-field>
					</div>
					<div class="md-layout-item" v-if="user.role === 'Rider'">
						<md-field>
							<label for="status">Status</label>
							<md-input type="text" name="status" id="status" v-model="data.status" :disabled="processing" />
						</md-field>
					</div>
					<div class="md-layout-item" v-if="user.role === 'Rider'">
						<md-checkbox v-model="data.delivered">Delivered</md-checkbox>
					</div>
				</div>
			</md-card-content>
			<md-card-actions>
				<md-button type="submit" class="md-primary" :disabled="processing">Submit</md-button>
			</md-card-actions>
		</md-card>
	</form>
</template>

<script lang="ts">
import { OrderContract } from '@/contracts/order.contract';
import { UserContract } from '@/contracts/user.contract';
import { handleError } from '@/helpers';
import { State } from '@/libraries/State';
import { orderService } from '@/services/order.service';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Order extends Vue {
	processing = false;

	state = State.getInstance();

	user = this.state.get<UserContract>('user')!;

	mode: 'Add' | 'Edit' = 'Add';

	data: OrderContract = {
		_id: '',
		details: '',
		amount: 0,
		status: '',
		delivered: false,
	};

	async created() {
		if (this.$route.path.includes('edit')) {
			try {
				const id = this.$route.params.id;
				this.data = await orderService.fetchOne(id);
				this.mode = 'Edit';
			} catch (error) {
				handleError(error);
				this.$router.go(-1);
			}
		}
	}

	async submit() {
		this.processing = true;
		try {
			await this.request();
			toastr.success('Order saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			this.processing = false;
			this.$router.go(-1);
		}
	}

	async request() {
		if (this.mode === 'Add') {
			return await orderService.create(this.data);
		} else {
			return await orderService.update(this.data._id, this.data);
		}
	}
}
</script>

<style scoped lang="scss">
.form {
	margin-top: 4rem !important;
}
</style>
