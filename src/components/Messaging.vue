<template>
	<div
		v-if="Object.values(messaging.sd.messages).length > 0"
		class="messaging"
	>
		<div class="container">
			<div
				v-for="(message, index) in messaging.sd.messages"
				:id="index"
				:key="index"
				class="message"
				v-html="message"
			/>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue'
export default {
	setup() {
		return { messaging: inject('messaging') }
	},
}
</script>

<style lang="scss" scoped>
.messaging {
	position: absolute;
	top: 0;
	left: 0;
	display: grid;
	align-items: center;
	justify-items: center;
	width: 100vw;
	height: 100vh;
	background: rgba(0,0,0,0.5);
	color: white;
	font-weight: bolder;

	.container {
		display: grid;
	}

	.message {
		background: rgba(0,0,0,0.9);
		padding: 10px;
		border-radius:10px;
		animation: floatup 2s;
		max-height: 50px;

		@keyframes floatup {
			0% {
				transform: scale(0,0);
			}
			25% {
				transform: scale(1.2,1.2);
				opacity: 1;
			}
			100% {
				transform: translate(0, -50px);
				opacity: 0;
			}
		}

		@media screen and (max-width: 700px) {
			@keyframes floatup {
				0% {
					transform: scale(0,0);
				}
				25% {
					transform: scale(1.2,1.2);
					opacity: 1;
				}
				100% {
					opacity: 0;
				}
			}
		}
	}
}
</style>