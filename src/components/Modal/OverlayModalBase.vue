<template>
	<div
		class="modal-base"
	>
		<div
			class="modal-content"
			:class="{dialog: isDialog}"
		>
			<div class="modal-title">
				{{ title }}
			</div>
			<div
				class="close"
				@click="$emit('close')"
			>
				<img src="../../assets/close.svg">
			</div>
			<div class="modal-slot">
				<slot />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: { 
		title: { type: String, default: 'Modal Title' },
		isDialog: { type: Boolean, default: false }
	},
	emits: ['close']
}
</script>

<style lang="scss">
.modal-base {
	position: absolute;
	top: 0;
	left: 0;
	display: grid;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.75);
	width: 100vw;
	height: 100vh;

	.modal-content {
		position: relative;
		width: 80vw;
		height: 80vh;
		background: linear-gradient(rgb(8, 177, 255), rgb(15, 120, 180));
		border-radius: 10px;

		@media screen and (max-width: 700px) {
			height: 100vh;
			width: 95vw;
		}

		.close {
			content: "x";
			position: absolute;
			top: 10px;
			right: 10px;

			&:hover {
				transform: scale(1.2, 1.2);
			}

			img {
				width: 15px;
			}
		}

		&.dialog {
			width: 40vw;
			height: auto;

			@media only screen and (max-width: 500px) {
				width: 80vw;
			}
			
			// .modal-slot {
			// 	display: grid;
			// 	grid-template-columns: auto auto;
			// 	grid-gap: 10px;

			// 	input[type="number"]{
			// 		border: none;
			// 		padding: 10px;
			// 		border-radius: 10px;
			// 	}
			// }
		}

		.modal-title {
			background: linear-gradient(rgb(255, 183, 50), orange);
			border-radius: 10px;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			padding: 10px;
			text-align: center;
		}
	}
}
</style>
