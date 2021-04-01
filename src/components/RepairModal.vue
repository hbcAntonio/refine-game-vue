<template>
	<div class="repair-modal">
		<div class="modal-content">
			<input
				type="button"
				value="close"
				class="close"
				@click="repair.sd.show = false"
			>
			<ul>
				<li
					v-for="material in repair.sd.materials"
					:key="material.nameid"
				>
					+{{ material.refineCount }} {{ material.name }}
					<input
						type="button"
						value="use"
						@click="repair.repair(material, refine.sd.equip, inventory)"
					>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue'

export default {
	setup() {
		const repair = inject('repair')
		const refine = inject('refine')
		const inventory = inject('inventory')

		return { repair, refine, inventory}
	}
}
</script>

<style lang="scss" scoped>
.repair-modal {
    color:white;
	height: 100vh;
	width: 100vw;
	display: grid;
	align-items: center;
	justify-items: center;
	position: absolute;
	top: 0;
	left: 0;

	.modal-content {
        display: grid;
        grid-template-rows: 50px auto;

        .close {
            justify-self: right;
            height: 50px;
        }

		z-index: 10;
		background: rgba(0, 0, 0, 0.589);
		border: 1px solid rgba(0, 0, 0, 0.589);
		border-radius: 20px;
		width: 500px;
		height: 400px;
	}
}
</style>