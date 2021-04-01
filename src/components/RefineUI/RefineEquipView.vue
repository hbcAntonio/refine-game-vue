<template>
	<div
		v-if="equip.name"
		class="selected-equip"
		:class="{'selected-equip__broken': equip.attribute}"
	>
		<div class="img-container">
			<img :src="itemviewtable[equip.resourceviewid]">
		</div>
		<span
			v-if="equip.refineCount"
			class="refine-count"
		>+{{ equip.refineCount }}</span><span
			class="equip-name"
		>{{ equip.name }}</span>

		<!-- requirements -->
		<div class="requirements">
			<div>
				<div>Zeny x{{ reqs.zeny }}</div>
				<div>{{ inventory.itemInfo(reqs.mat).name }} x1</div>
			</div>

			<input
				v-if="equip.attribute"
				type="button"
				class="repair-btn"
				value="repair"
				@click="$emit('repair')"
			>
		</div>
	</div>
</template>

<script>
import * as itemviewtable from '../../functions/itemviewtable.js'
import inventory from '../../functions/core/inventory'

export default {
	props: { 
		equip: { type: Object, default: () => {} },
		reqs: { type: Object, default: () => {} }
	},
	emits: ['repair'],
	setup() { 
		return { itemviewtable, inventory } 
	}
}
</script>