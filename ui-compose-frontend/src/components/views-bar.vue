<template>
	<div class="views-bar-container">Stuff</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator'

	@Component
	export default class ViewsBar extends Vue {

	}
</script>

<style lang="scss">
@import "../styles/colors.scss";

.views-bar-container {
	background: theme-color("background", "light");
	color: theme-color("foreground");
	height: 100%;
	overflow: auto;
	padding: 0.5em;
}
</style>