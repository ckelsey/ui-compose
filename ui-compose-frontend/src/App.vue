<template>
	<div id="app">
		<top-bar></top-bar>
		<div class="app-content">
			<views-bar></views-bar>
			<content-viewer></content-viewer>
			<inspector-bar></inspector-bar>
		</div>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue'
	import TopBar from './components/top-bar.vue'
	import ViewsBar from './components/views-bar.vue'
	import InspectorBar from './components/inspector-bar.vue'
	import ContentViewer from './components/content-viewer.vue'

	export default {
		name: 'App',
		components: {
			'top-bar': TopBar,
			'views-bar': ViewsBar,
			'inspector-bar': InspectorBar,
			'content-viewer': ContentViewer
		}
	}
</script>

<style lang="scss">
@import "./styles/helpers.scss";

html {
	height: 100%;
	min-height: 100%;
	width: 100%;
	background-color: #fafafa;
}

body {
	height: 100%;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: 16px;
	font-weight: 100;
	line-height: 1.5em;
	color: #282828;
	margin: 0;
}

#app {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.app-content {
	display: flex;
	width: 100%;
	flex-grow: 1;
}
</style>
