<template>
	<div class="page-container">
		<md-app>
			<md-app-drawer md-permanent="full">
				<toolbar title="Dashboard" :subtitle="user.role" />

				<md-list>
					<router-link to="/rider/orders">
						<md-list-item>
							<md-icon>move_to_inbox</md-icon>
							<span class="md-list-item-text">Orders</span>
						</md-list-item>
					</router-link>
				</md-list>
			</md-app-drawer>

			<md-app-content>
				<md-button class="md-icon-button md-accent md-raised logout" @click.prevent="logout">
					<md-icon>logout</md-icon>
				</md-button>
				<router-view />
			</md-app-content>
		</md-app>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Toolbar from '@/components/Toolbar.vue';
import { UserContract } from '@/contracts/user.contract';
import { Asker } from '@/helpers';
import { State } from '@/libraries/State';
import axios from 'axios';

@Component({
	components: {
		Toolbar,
	},
})
export default class Home extends Vue {
	state = State.getInstance();

	user = this.state.get<UserContract>('user')!;

	async logout() {
		if (await Asker.notice('Are you sure you want to logout?')) {
			this.state.clear();
			axios.get('/auth/logout').catch(console.error);
			toastr.info('You have logged out.');
			this.$router.push('/login');
		}
	}
}
</script>

<style scoped lang="scss">
.page-container {
	height: 100vh;
}

.md-app {
	height: 100%;
}

// Demo purposes only
.md-drawer {
	width: 230px;
	max-width: calc(100vw - 125px);
}

.logout {
	position: absolute;
	right: 20px;
	top: 20px;
}
</style>
