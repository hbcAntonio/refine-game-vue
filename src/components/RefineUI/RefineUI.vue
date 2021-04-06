<template>
	<OverlayModalBase
		title="Holgrehenn's Refine Shop"
		@close="refine.sd.show=false"
	>
		<div class="main-refine">
			<RefinableEquipList
				:inventory="inventory"
				:uid="refine.sd.equip.uid"
				@select-equip="refine.setEquip"
			/>

			<div class="refine-interface">
				<RefineDialog :dialog="refine.sd.dialog" />
				<RefineEquipView
					:equip="refine.sd.equip"
					:reqs="refine.getReqs(inventory)"
					@repair="repair.start(inventory, refine.sd.equip)"
				/>
				<input
					v-if="refine.sd.equip.name"
					type="button"
					:value="refine.sd.equip.attribute ? 'Repair' : 'Refine'"
					class="btn btn-primary"
					@click="() => refine.sd.equip.attribute ? repair.start(inventory, refine.sd.equip) : refine.start(inventory)"
				>
			</div>
		</div>
	</OverlayModalBase>
</template>

<script>
import { inject } from 'vue'
import OverlayModalBase from '../Modal/OverlayModalBase.vue'
import RefinableEquipList from './RefinableEquipList.vue'
import RefineDialog from './RefineDialog.vue'
import RefineEquipView from './RefineEquipView.vue'

export default {
	components: { RefinableEquipList, RefineDialog, RefineEquipView, OverlayModalBase},
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

<style lang="scss" scoped>

.main-refine {
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: 100%;
	padding: 10px;

	@media screen and (max-width: 700px) {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 2fr;
		grid-gap: 10px;
	}

    .refine-interface {
		background: url('../../assets/holgrehenn-bg.jpg') center no-repeat;
		background-size: 70% auto;
		background-position: auto -130px;
		background-color: black;
		border-radius: 10px;
        padding: 20px;
		color: white;

		display: grid;
		grid-template-rows: 1fr 3fr 50px;
		grid-gap: 5px;

		@media screen and (max-width: 700px) {
			background: url('../../assets/holgrehenn-bg.jpg') top bottom no-repeat;
			background-size: 100% auto;
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			max-height: 360px;

			background-position: 0 -130px;
		}

		#sprite-container {
			#sprite-image {
				height: 194px;
				width: 194px;
				transform: scale(2,2);
				background: url('./assets/successrefine.png')
					0px 0px;
					$time: 0.45s;
				animation: succesrefineeffect-y $time steps(4) infinite,succesrefineeffect-x $time steps(5) infinite;
			}

			@keyframes succesrefineeffect-y {
				0% { background-position-y: 0; }
				100% { background-position-y: -768px; }
			}

			@keyframes succesrefineeffect-x {
				0% { background-position-x: 0; }
				100% { background-position-x: -960px; }
			}
		}

		.refine-btn {
			transition: all 0.05s ease-in;
			padding: 10px;
			border: none;
			background: orange;
			border-radius: 10px;
			font-size: 1.2rem;
			margin-top: 10px;
			justify-self: right;
			width: 120px;

			&:hover{
				transform: scale(1.05,1.05);
			}
		}

		// .dialog {
		// 	background: linear-gradient(white, rgb(224, 224, 224));
		// 	color: black;
		// 	padding: 20px;
		// 	border-radius: 20px;
		// 	border: 2px solid rgb(172, 172, 172);
		// 	font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
		// 	font-size: 2rem;

		// 	display: grid;
		// 	align-items: center;
		// 	justify-items: center;

		// 	p {
		// 		padding: 0;
		// 		margin: 0;
		// 	}
		// }
    }
}
</style>