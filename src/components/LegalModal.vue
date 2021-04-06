<template>
	<!-- Help Modal -->
	<OverlayModalBase
		title="Disclaimers"
		:is-dialog="true"
		@close="$emit('close')"
	>
		<div
			class="help-text"
			style="padding: 20px; overflow: scroll;"
		>
			<p><b>Information Collection And Use</b></p>
			<p>This website does not collect any sort of data. No <b>cookies</b> are stored in the browser. Data saved in the browser is solely used for the application state management (i.e. saving/loading progress)</p>
			<p><b>Content ownership</b></p>
			<p>This website's source code belongs to the author. All graphic assets (i.e. item sprites) belong to Gravity Inc. and the SVGs used belong to the respective original creator.</p>
			<p><b>Affiliation Disclaimer</b></p>
			<p>The author of this website is in no way affiliated with the Ragnarok Online trademark or Gravity Inc.</p>
			<p><b>Revenue Disclaimer</b></p>
			<p>Access to this website is free, and the service is not monetized in any ways (e.g. ad revenue).</p>
		</div>
	</OverlayModalBase>
</template>

<script>
import OverlayModalBase from './Modal/OverlayModalBase.vue'
export default {
	components: { OverlayModalBase }
}
</script>

<style lang="scss" scoped>
.help-text {
	color: rgb(32, 32, 11);

	strong {
		font-size: 1.0rem;
		color: black;
		text-decoration: underline;
	}
}
</style>