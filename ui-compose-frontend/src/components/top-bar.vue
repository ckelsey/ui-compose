<template>
	<div class="top-bar-container page-padding row-items">
		<span class="site-path"></span>
		<div class="top-bar-right">
			<div class="row-items">
				<span>Save</span>
				<span>Preview</span>
				<span>Publish</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator'

	@Component
	export default class TopBar extends Vue {
		@Prop() private path!: string
	}
</script>

<style lang="scss">
@import "../styles/colors.scss";

.top-bar-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	background: theme-color("background", "light");
	color: theme-color("foreground");
}

.top-bar-right {
	margin-right: 0;
}
</style>
