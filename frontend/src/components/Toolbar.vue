<template>
	<md-app-toolbar class="md-primary">
		<span class="md-title">{{ title }} - {{ subtitle }}</span>
	</md-app-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
	@Prop(String) readonly title: string;
	@Prop(String) readonly subtitle: string;
}
</script>

<style scoped lang="scss">
.md-title {
	font-size: 16px;
}
</style>
