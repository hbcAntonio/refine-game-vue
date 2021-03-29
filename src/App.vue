<template>
  <RepairModal
    v-if="repair.sd.show"
    v-bind="repair.sd"
    @use="repair.repair(inventory, refine.sd.equip)"
    @close="repair.sd.show = false"
  />

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
        @click="refine.start"
      >
	
      <RefineEquipView
        :equip="refine.sd.equip"
        @repair="repair.start(inventory, refine.sd.equip)"
      />

    <!-- <div id="sprite-container">
      <div id="sprite-image" />
    </div> -->
    </div>
  </div>
</template>

<script>
import RepairModal from './components/RepairModal.vue'
import RefinableEquipList from './components/RefinableEquipList.vue'
import RefineDialog from './components/RefineDialog.vue'
import RefineEquipView from './components/RefineEquipView.vue'

import inventory from './functions/core/inventory'
import refine from './functions/core/refine'
import repair from './functions/core/repair'

export default {
	components: { RepairModal, RefinableEquipList, RefineDialog, RefineEquipView },
	data() {
		return {
			inventory,
			refine, 
			repair
		}
	},
}
</script>

<style lang="scss">
.main-refine {
	padding: 40px;

	pre {
		background: rgba(0, 0, 0, 0.438);
		color: greenyellow;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		height: 100px;
		overflow-y: scroll;
	}
	
	font-family: Arial, Helvetica, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: calc(100vh - 80px);

    .refine-interface {
		background: url('./assets/holgrehenn-bg.jpg');
        padding: 20px;
		color: white;
		display: grid;
		grid-template-rows: 200px 55px auto;

		.selected-equip {
			padding: 20px;
			background: rgba(0, 0, 0, 0.315);
			color: white;
			border: 1px solid black;

			display: grid;
			align-items: center;
			justify-items: center;

			img {
				width: 100px;
				height: 100px;
			}

			.refine-count {
				font-size: 2.25rem;
				border: 1px solid black;
				padding: 10px;
				background: rgba(0, 0, 0, 0.404);
				border-radius: 50px;
				margin: 20px;
			}

			.equip-name {
				font-size: 1.7rem;
			}

			&__broken {
				.equip-name {
					color: red;
				}

				.refine-count {
					color: red;
				}

				.img-container::after {
					position: absolute;
					margin-left: -100px;
					content: 'BROKEN';
					color: red;
					width: 100px;
					height: 100px;
					background: rgba(255, 0, 0, 0.26);
				}
			}

			align-self: center;
			justify-self: center;
		}

		#sprite-container {
			z-index: 100;

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
			border: 1px solid rgb(119, 119, 119);
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

		.dialog {
			background: white;
			color: black;
			padding: 20px;
			border-radius: 20px;
			border: 2px solid rgb(172, 172, 172);
			font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
			font-size: 2rem;

			display: grid;
			align-items: center;
			justify-items: center;
		}
    }
}
</style>