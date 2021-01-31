<template>
	<div class="inspector-bar-container">Inspectin</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator'

	@Component
	export default class InspectorBar extends Vue {

	}
</script>

<style lang="scss">
@import "../styles/colors.scss";

.inspector-bar-container {
	background: theme-color("background", "light");
	color: theme-color("foreground");
	height: 100%;
	overflow: auto;
	padding: 0.5em;
}
</style>