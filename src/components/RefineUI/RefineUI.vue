<template>
	<div class="main-refine">
		<RefinableEquipList
			:inventory="inventory"
			@select-equip="refine.setEquip"
		/>

		<div class="refine-interface">
			<RefineDialog :dialog="refine.sd.dialog" />

			<input
				type="button"
				value="Refine"
				class="refine-btn"
				@click="refine.start(inventory)"
			>
	
			<RefineEquipView
				:equip="refine.sd.equip"
				:reqs="refine.getReqs(inventory)"
				@repair="repair.start(inventory, refine.sd.equip)"
			/>

			<!-- <div id="sprite-container">
				<div id="sprite-image" />
			</div> -->
		</div>
	</div>
</template>

<script>
import { inject } from 'vue'

import RefinableEquipList from './RefinableEquipList.vue'
import RefineDialog from './RefineDialog.vue'
import RefineEquipView from './RefineEquipView.vue'

export default {
	components: { RefinableEquipList, RefineDialog, RefineEquipView },
	setup() {
		const inventory = inject('inventory')
		const refine = inject('refine')
		const repair = inject('repair')

		return {
			inventory,
			refine,
			repair
		}
	},
}

</script>
