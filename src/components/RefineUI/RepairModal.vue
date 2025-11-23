<template>
	<OverlayModalBase
		title="Choose repair materials"
		:is-dialog="true"
		@close="repair.sd.show = false"
	>
		<div class="repair-modal">
			<div class="repair-info">
				<div class="repair-progress">
					<div class="progress-label">
						<span>Materials Needed</span>
						<span class="points-display" :class="{ 'enough': selectedPoints >= requiredPoints }">
							{{ selectedPoints }} / {{ requiredPoints }}
						</span>
					</div>
					<div class="progress-bar-container">
						<div
							class="progress-bar"
							:class="{ 'complete': selectedPoints >= requiredPoints }"
							:style="{ width: Math.min(100, (selectedPoints / requiredPoints) * 100) + '%' }"
						>
							<div v-if="selectedPoints >= requiredPoints" class="checkmark">✓</div>
						</div>
					</div>
				</div>
				<p class="hint">
					💡 Tip: Whole items worth 1 point, Broken items worth their + level
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
				// Only add if we haven't reached required points yet
				const currentPoints = repair.getSelectedPoints()
				const required = repair.getRequiredPoints(repair.sd.brokenEquip)

				// Don't allow adding if we already have enough points
				if (currentPoints < required) {
					repair.sd.selectedMaterials.push(material)
				}
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

		.repair-progress {
			margin-bottom: 10px;

			.progress-label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 8px;
				font-weight: 500;

				.points-display {
					font-size: 1.1rem;
					padding: 4px 12px;
					border-radius: 12px;
					background: rgba(255, 165, 0, 0.2);
					color: rgb(255, 140, 0);
					transition: all 0.3s ease;

					&.enough {
						background: rgba(50, 205, 50, 0.2);
						color: rgb(34, 139, 34);
						font-weight: bold;
					}
				}
			}

			.progress-bar-container {
				width: 100%;
				height: 24px;
				background: rgba(0, 0, 0, 0.2);
				border-radius: 12px;
				overflow: hidden;
				box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

				.progress-bar {
					height: 100%;
					background: linear-gradient(90deg, rgb(255, 165, 0), rgb(255, 140, 0));
					transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
					display: flex;
					align-items: center;
					justify-content: flex-end;
					padding-right: 8px;
					position: relative;

					&.complete {
						background: linear-gradient(90deg, rgb(50, 205, 50), rgb(34, 139, 34));
						animation: pulse-green 1.5s ease-in-out infinite;
					}

					.checkmark {
						color: white;
						font-weight: bold;
						font-size: 1.1rem;
						text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
					}

					@keyframes pulse-green {
						0%, 100% {
							opacity: 1;
						}
						50% {
							opacity: 0.8;
						}
					}
				}
			}
		}

		p {
			margin: 5px 0;
			text-align: center;
		}

		.hint {
			font-size: 0.85rem;
			color: rgba(0, 0, 0, 0.6);
			margin-top: 8px;
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