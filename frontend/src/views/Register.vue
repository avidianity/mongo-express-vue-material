<template>
	<div class="root">
		<form novalidate class="md-layout" @submit.prevent="submit">
			<md-card class="md-layout-item">
				<md-card-header>
					<div class="md-title">Register</div>
					<div class="md-subtitle">Please fill in your credentials below.</div>
				</md-card-header>
				<md-card-content>
					<div class="lg-layout md-gutter">
						<div class="md-layout-item">
							<md-field>
								<label for="name">Name</label>
								<md-input type="text" name="name" id="name" v-model="data.name" :disabled="processing" />
							</md-field>
						</div>
						<div class="md-layout-item">
							<md-field>
								<label for="email">Email</label>
								<md-input type="email" name="email" id="email" v-model="data.email" :disabled="processing" />
							</md-field>
						</div>
						<div class="md-layout-item">
							<md-field>
								<label for="password">Password</label>
								<md-input type="password" name="password" id="password" v-model="data.password" :disabled="processing" />
							</md-field>
						</div>
						<div class="md-layout-item">
							<md-field>
								<label for="role">Type</label>
								<md-select name="role" id="role" v-model="data.role" :disabled="processing">
									<md-option value="Rider">Rider</md-option>
									<md-option value="Customer">Customer</md-option>
								</md-select>
							</md-field>
						</div>
					</div>
				</md-card-content>
				<md-card-actions>
					<md-button type="submit" class="md-primary" :disabled="processing">Submit</md-button>
					<md-button type="button" class="md-accent" :disabled="processing" @click.prevent="login">Login</md-button>
				</md-card-actions>
			</md-card>
		</form>
	</div>
</template>

<script lang="ts">
import { handleError } from '@/helpers';
import { State } from '@/libraries/State';
import { userService } from '@/services/user.service';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Register extends Vue {
	processing = false;

	data = {
		name: '',
		email: '',
		password: '',
		role: '',
	};

	state = State.getInstance();

	async submit() {
		this.processing = true;
		try {
			const { user, token } = await userService.register(this.data);
			this.state.set('user', user).set('token', token);
			toastr.success(`Welcome, ${user.name}!`);
			this.$router.push(`/${user.role.toLowerCase()}/orders`);
		} catch (error) {
			handleError(error);
		} finally {
			this.processing = false;
		}
	}

	login() {
		this.$router.push('/login');
	}
}
</script>

<style scoped lang="scss">
.root {
	height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.md-card {
	padding-left: 1rem;
	padding-right: 1rem;
}
</style>
