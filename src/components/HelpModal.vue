<template>
	<!-- Help Modal -->
	<OverlayModalBase
		title="Help"
		:is-dialog="true"
		@close="$emit('close')"
	>
		<div
			class="help-text"
			style="padding: 20px"
		>
			Here's how you play the game:
			<p>Your goal is to make as much money as possible before running out of possiblities to "refine" your items.</p>
			<p>The higher the item refine level, the more money it's worth!</p>
			<p>
				Items require specific materials. Some require <strong>Elunium</strong>, some require <strong>Oridecon</strong>. The further you are into the refine process, all the way up to the <strong>max of +15</strong>, the <strong>more expensive refining gets</strong>.
			</p><p>
				During the process, you migh <strong>break</strong> items. That deeply affects the <strong>sell</strong> value and <strong>items cannot be upgraded while broken.</strong>
			</p><p>
				In order to <strong>repair a broken item</strong> you must use a material which refine level is <strong>+5 or below</strong>.
			</p>
			<p>The success chance changes over time! Does it pay to be greedy?</p>
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