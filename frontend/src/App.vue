<template>
	<router-view />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
body {
	padding: 0;
	margin: 0;
}
</style>
