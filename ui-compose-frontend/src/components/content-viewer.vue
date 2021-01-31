<template>
	<div class="content-viewer-container">Heyoo</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator'

	@Component
	export default class ContentViewer extends Vue {

	}
</script>

<style lang="scss">
@import "../styles/colors.scss";

.content-viewer-container {
	flex-grow: 1;
	height: 100%;
	overflow: auto;
	position: relative;
	z-index: 10;
	box-shadow: 0 1em 3.33em -1em transparentize(theme-color("background", "dark"), 0.15),
		0 0.25em 1.33em 0em
			transparentize(theme-color("background", "dark"), 0.66);
}
</style>
