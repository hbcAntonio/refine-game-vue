<template>
	<OverlayModalBase
		title="Choose repair materials"
		:is-dialog="true"
		@close="repair.sd.show = false"
	>
		<div class="repair-modal">
			<div class="repair-info">
				<p>
					<strong>Required:</strong> {{ requiredPoints }} {{ requiredPoints === 1 ? 'point' : 'points' }}
				</p>
				<p>
					<strong>Selected:</strong> {{ selectedPoints }} {{ selectedPoints === 1 ? 'point' : 'points' }}
				</p>
				<p class="hint">
					Non-broken items = 1 point, Broken items = their + level
				</p>
			</div>
			<ul>
				<li
					v-for="material in repair.sd.materials"
					:key="material.uid"
					:class="{ 'selected': isSelected(material) }"
				>
					<ItemThumb
						:item="material"
						@click="toggleMaterial(material)"
					/>
					<span class="item-points">{{ repair.getItemPoints(material) }}pt</span>
				</li>
			</ul>
			<div class="repair-actions">
				<input
					type="button"
					class="btn btn-cancel"
					value="Cancel"
					@click="repair.sd.show = false"
				>
				<input
					type="button"
					class="btn btn-primary"
					value="Repair"
					:disabled="selectedPoints < requiredPoints"
					@click="confirmRepair"
				>
			</div>
		</div>
	</OverlayModalBase>

	<OverlayModalBase
		v-if="showConfirmDialog"
		title="Are you sure?"
		:is-dialog="true"
		@close="showConfirmDialog=false"
	>
		<div class="confirm">
			<p>Are you sure you would like to use {{ repair.sd.selectedMaterials.length }} {{ repair.sd.selectedMaterials.length === 1 ? 'item' : 'items' }} as materials?</p>
			<input
				type="button"
				class="btn btn-cancel"
				value="Cancel"
				@click="showConfirmDialog=false"
			>
			<input
				type="button"
				class="btn btn-primary"
				value="Use these items"
				@click="repairItem"
			>
		</div>
	</OverlayModalBase>
</template>

<script>
import OverlayModalBase from '../Modal/OverlayModalBase.vue'
import ItemThumb from '../Inventory/ItemThumb.vue'
import { inject, ref, computed } from 'vue'

export default {
	components: { ItemThumb, OverlayModalBase },
	setup() {
		const repair = inject('repair')
		const refine = inject('refine')
		const inventory = inject('inventory')

		const showConfirmDialog = ref(false)

		const requiredPoints = computed(() => {
			return repair.sd.brokenEquip ? repair.getRequiredPoints(repair.sd.brokenEquip) : 0
		})

		const selectedPoints = computed(() => {
			return repair.getSelectedPoints()
		})

		const isSelected = (material) => {
			return repair.sd.selectedMaterials.some(mat => mat.uid === material.uid)
		}

		const toggleMaterial = (material) => {
			const index = repair.sd.selectedMaterials.findIndex(mat => mat.uid === material.uid)
			if (index >= 0) {
				// Remove if already selected
				repair.sd.selectedMaterials.splice(index, 1)
			} else {
				// Add if not selected
				repair.sd.selectedMaterials.push(material)
			}
		}

		const confirmRepair = () => {
			if (selectedPoints.value >= requiredPoints.value) {
				showConfirmDialog.value = true
			}
		}

		const repairItem = () => {
			repair.repair(repair.sd.selectedMaterials, refine.sd.equip, inventory)
			showConfirmDialog.value = false
		}

		return {
			repair,
			refine,
			inventory,
			repairItem,
			showConfirmDialog,
			requiredPoints,
			selectedPoints,
			isSelected,
			toggleMaterial,
			confirmRepair
		}
	},
}
</script>

<style lang="scss" scoped>
.repair-modal {
	display: grid;
	align-items: center;
	justify-items: center;
	margin: 10px;
	gap: 15px;

	.repair-info {
		background: rgba(0, 0, 0, 0.1);
		padding: 15px;
		border-radius: 10px;
		width: 100%;
		text-align: center;

		p {
			margin: 5px 0;
		}

		.hint {
			font-size: 0.85rem;
			color: rgba(0, 0, 0, 0.6);
			font-style: italic;
		}
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(5, 60px);
		gap: 10px;

		li {
			position: relative;
			border: 2px solid transparent;
			border-radius: 5px;
			padding: 3px;
			cursor: pointer;
			transition: all 0.2s ease;

			&:hover {
				border-color: rgba(255, 189, 65, 0.5);
				transform: translateY(-2px);
			}

			&.selected {
				border-color: rgb(255, 189, 65);
				background: rgba(255, 189, 65, 0.2);
				transform: scale(1.05);
			}

			.item-points {
				position: absolute;
				bottom: -2px;
				right: 2px;
				background: rgba(0, 0, 0, 0.8);
				color: white;
				padding: 2px 4px;
				border-radius: 3px;
				font-size: 0.7rem;
				font-weight: bold;
			}
		}
	}

	.repair-actions {
		display: flex;
		gap: 10px;
		margin-top: 10px;

		input:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
}

.confirm {
	padding: 10px;

	input {
		margin-right: 10px;
	}
}
</style>