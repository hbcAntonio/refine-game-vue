<template>
  <repair-modal
    v-if="sd.repair.show"
    v-bind="sd.repair"
    @use="repairItem"
    @close="sd.repair.show = false"
  />
  <div class="main-refine">
    <div class="equip-list">
      <ul>
        <li
          v-for="equip in equips"
          :key="equip.nameid"
          :class="{broken:equip.attribute}"
          @click="selectEquip(equip)"
        >
          <img :src="itemviewtable[equip.resourceviewid]">
          <span
            v-if="equip.refineCount"
            class="refine-count"
          >+{{ equip.refineCount }}</span><span
            class="equip-name"
          >{{ equip.name }}</span>
        </li>
      </ul>
    </div>

    <div class="refine-interface">
      <div class="dialog">
        <p>{{ dialog }}</p>
      </div>

      <input
        type="button"
        value="Refine"
        class="refine-btn"
        @click="refine"
      >
	
      <div
        v-if="selectedEquip"
        class="selected-equip"
        :class="{'selected-equip__broken': selectedEquip.attribute}"
      >
        <div class="img-container">
          <img :src="itemviewtable[selectedEquip.resourceviewid]">
        </div>
        <span
          v-if="selectedEquip.refineCount"
          class="refine-count"
        >+{{ selectedEquip.refineCount }}</span><span
          class="equip-name"
        >{{ selectedEquip.name }}</span>

        <input
          v-if="selectedEquip.attribute"
          type="button"
          class="repair-btn"
          value="repair"
          @click="repair"
        >
      </div>
    

    <!-- <div id="sprite-container">
      <div id="sprite-image" />
    </div> -->
    </div>
  </div>
  

  <!-- <pre><div>{{ selectedEquip }}</div></pre> -->
</template>

<script>
import RepairModal from './components/RepairModal.vue'
import * as itemviewtable from './functions/itemviewtable'

const MAX_REFINE = 15
const MIN_REFINE = 0
const REFINE_TIME = 625
const SUCCESS_RATE = .5
const BREAK_RATE = .99

const DIALOG_MAP = {
	EMPTY_SLOT: 'Should I refine your body then?!',
	SUCCESS_REFINE: 'Splendid job I did! So happy for you!',
	FAILURE_REFINE: 'Oh no... I swear I will try to do better next time!',
	BREAK_REFINE: 'I... don\'t even know what to say!!!',
	IDLE: 'My name is Holgrehenn, and I hate you!',
	REFINING: 'Here we go...',
	BUSY: 'I happen to be busy already....',
	BROKEN: 'I cannot refine broken items...'
}

const generateEquip = (i=3) => {
	return i % 2 ? 
		{id: 'ancient-cape', resourceviewid: 'ancientcape', resourceview: {}, nameid: `ancient-cape-${i}`, name: 'Ancient Cape', refineCount: 4, attribute: 0} : 
		{id: 'critical-ring', resourceviewid: 'criticalring', resourceview: {}, nameid: `critical-ring-${i}`, name: 'Critical Ring', refineCount: 4, attribute: 0}
}

const clif_refine_sub = (equip, success) => {
	if (equip.refineCount < 4) success = true

	equip.refineCount += 1 * (success ? 1: -1)
	equip.refineCount = equip.refineCount > MAX_REFINE ? 15 : (equip.refineCount < MIN_REFINE ? 0 : equip.refineCount)

	return success
}

const clif_refine = (equip, rate=SUCCESS_RATE, breakRate=BREAK_RATE) => {
	if (equip.attribute) return false

	if (!clif_refine_sub(equip, Math.random() < rate)) {
		const shouldBreak = Math.random() < breakRate
		equip.attribute = shouldBreak ? 1 : 0
		return false
	}

	return true
}

const clif_refine_stop_check = (sd, equip) => {
	if (sd.refining) return DIALOG_MAP.BUSY
	if (!equip) return DIALOG_MAP.EMPTY_SLOT
	if (equip.attribute) return DIALOG_MAP.BROKEN
	return 
}

export default {
	components: { RepairModal},
	data() {
		return {
			equips: Array.from(Array(5)).map((el, index)=> generateEquip(index)),
			selectedEquip: '',
			itemviewtable,
			dialog: DIALOG_MAP.IDLE,
			sd: { refining: false, successRate: 0.5, repair: { show: false, materials: []} }
		}
	},

	created() {
		console.log({itemviewtable})
	},

	methods: {
		selectEquip(equip) {
			this.selectedEquip = equip
		},

		repairItem($event) {
			this.selectedEquip.attribute = 0
			this.equips.splice(this.equips.findIndex(equip => equip.nameid === $event.nameid), 1)
			this.sd.repair.show = false
		},

		async refine() {
			this.dialog = clif_refine_stop_check(this.sd, this.selectedEquip)
			if (this.dialog) {
				return
			}

			this.sd.refining = true
			this.dialog = DIALOG_MAP.REFINING

			await new Promise(resolve => setTimeout(() => {
				if (clif_refine(this.selectedEquip)) {
					this.dialog = DIALOG_MAP.SUCCESS_REFINE
					resolve()
					return
				}

				this.dialog = this.selectedEquip.attribute ? DIALOG_MAP.BREAK_REFINE : DIALOG_MAP.FAILURE_REFINE
				resolve()
			}, REFINE_TIME))

			this.sd.refining = false
		},

		repair() {
			// needs to have at least one of the same item

			// look for an equip that is the same
			const equips = this.equips
			const materials = equips.filter(equip => equip.id === this.selectedEquip.id && equip.nameid !== this.selectedEquip.nameid)

			if (materials.length) {
				this.sd.repair.show = true
				this.sd.repair.materials = materials
			}
		}
	}
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
	
	.equip-list {
		font-size: 1.25rem;
		color: blue;
		background: #f5f5f5;
		color: rgb(0, 0, 0);
		padding: 20px;

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				transition: all 0.1s ease;
				padding: 20px;
				background: white;
				border-radius: 20px;
				margin-bottom: 10px;
				display: grid;
				grid-template-columns: 1fr 1fr 5fr;
				align-items: center;

				img {
					width: 35px;
					height: 35px;
					mix-blend-mode: multiply;
				}
			}

			li:hover {
				background: rgb(255, 187, 0);
				transform: scale(1.05, 1.05);
			}
		}

		.refine-count {
			font-weight: bolder;
			padding: 5px;
		}

		.equip-name {
			padding: 5px;
		}

		.broken {
			color: red;
		}
	}

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