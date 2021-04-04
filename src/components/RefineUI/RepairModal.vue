<template>
	<OverlayModalBase
		title="Choose an item"
		:is-dialog="true"
		@close="repair.sd.show = false"
	>
		<div class="repair-modal">
			<ul>
				<li
					v-for="material in repair.sd.materials"
					:key="material.nameid"
				>
					<ItemThumb
						:item="material"
						@click="confirm(material)"
					/>
				</li>
			</ul>
		</div>
	</OverlayModalBase>

	<OverlayModalBase
		v-if="showConfirmDialog"
		title="Are you sure?"
		:is-dialog="true"
		@close="showConfirmDialog=false"
	>
		<div class="confirm">
			<p>Are you sure you would like to use this item as a material?</p>
			<input
				type="button"
				class="btn btn-cancel"
				value="Cancel"
			>
			<input
				type="button"
				class="btn btn-primary"
				value="Use this item"
				@click="repairItem"
			>
		</div>
	</OverlayModalBase>
</template>

<script>
import OverlayModalBase from '../Modal/OverlayModalBase.vue'
import ItemThumb from '../Inventory/ItemThumb.vue'
import { inject, ref } from 'vue'

export default {
	components: { ItemThumb, OverlayModalBase },
	setup() {
		const repair = inject('repair')
		const refine = inject('refine')
		const inventory = inject('inventory')

		const showConfirmDialog = ref(false)
		let selectedMat = {}

		const confirm = (mat) => {
			showConfirmDialog.value = true
			selectedMat = mat
		}

		const repairItem = () => {
			repair.repair(selectedMat, refine.sd.equip, inventory)
			showConfirmDialog.value = false
		}

		return { repair, refine, inventory, confirm, repairItem, showConfirmDialog}
	},
}
</script>

<style lang="scss" scoped>
.repair-modal {
	display: grid;
	align-items: center;
	justify-items: center;
	margin: 10px;
	ul {
		list-style: none;
		padding: 0;
		margin: 0;

		display: grid;
		grid-template-columns: repeat(5, 50px);
	}
}

.confirm {
	padding: 10px;

	input {
		margin-right: 10px;
	}
}
</style>