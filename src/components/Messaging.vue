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
	background: rgba(0, 0, 0, 0.5);
	color: white;
	font-weight: bolder;
	pointer-events: none;
	z-index: 9999;

	.container {
		display: grid;
		gap: 10px;
	}

	.message {
		background: rgba(0, 0, 0, 0.95);
		padding: 20px 30px;
		border-radius: 15px;
		animation: floatup 2s cubic-bezier(0.4, 0, 0.2, 1);
		max-height: 80px;
		font-size: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);

		@keyframes floatup {
			0% {
				transform: scale(0) translateY(0);
				opacity: 0;
			}
			15% {
				transform: scale(1.15) translateY(0);
				opacity: 1;
			}
			30% {
				transform: scale(1) translateY(0);
				opacity: 1;
			}
			85% {
				transform: scale(1) translateY(-30px);
				opacity: 1;
			}
			100% {
				transform: scale(0.8) translateY(-60px);
				opacity: 0;
			}
		}

		@media screen and (max-width: 700px) {
			font-size: 1.2rem;
			padding: 15px 25px;

			@keyframes floatup {
				0% {
					transform: scale(0);
					opacity: 0;
				}
				15% {
					transform: scale(1.15);
					opacity: 1;
				}
				30% {
					transform: scale(1);
					opacity: 1;
				}
				85% {
					opacity: 1;
				}
				100% {
					transform: scale(0.9);
					opacity: 0;
				}
			}
		}
	}
}
</style>