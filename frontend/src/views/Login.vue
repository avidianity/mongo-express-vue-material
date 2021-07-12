<template>
	<div class="root">
		<form novalidate class="md-layout" @submit.prevent="submit">
			<md-card class="md-layout-item">
				<md-card-header>
					<div class="md-title">Login</div>
					<div class="md-subtitle">Please fill in your credentials below.</div>
				</md-card-header>
				<md-card-content>
					<div class="lg-layout md-gutter">
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
					</div>
				</md-card-content>
				<md-card-actions>
					<md-button type="submit" class="md-primary" :disabled="processing">Submit</md-button>
					<md-button type="button" class="md-accent" :disabled="processing" @click.prevent="register">Register</md-button>
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
export default class Login extends Vue {
	processing = false;

	data = {
		email: '',
		password: '',
	};

	state = State.getInstance();

	async submit() {
		this.processing = true;
		try {
			const { user, token } = await userService.login(this.data);
			this.state.set('user', user).set('token', token);
			toastr.success(`Welcome back, ${user.name}!`);
			this.$router.push(`/${user.role.toLowerCase()}/orders`);
		} catch (error) {
			handleError(error);
		} finally {
			this.processing = false;
		}
	}

	register() {
		this.$router.push('/register');
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
