<template>
	<!-- Main application -->
	<div class="main">
		<!-- Hollgrehen -->
		<div class="holgrehenn-illust" />
		
		<!-- Options -->
		<div class="options">
			<ul>
				<li>
					<input
						type="button"
						value="Help"
						class="btn btn-primary"
						@click="showHelpModal=true"
					>
				</li>
				<li>
					<input
						type="button"
						value="Legal"
						class="btn btn-primary"
						@click="showLegalModal=true"
					>
				</li>
			</ul>
		</div>

		<!-- Zeny -->
		<div class="zeny">
			{{ inventory.zeny(undefined, false) }}
		</div>

		<!-- Game options -->
		<div class="game-main">
			<div class="actions">
				<input
					type="button"
					class="btn btn-primary"
					value="Refine!"
					@click="() => refine.sd.show = true"
				>
				<input
					type="button"
					class="btn btn-primary"
					value="Inventory"
					@click="inventory.sd.show = true"
				>
				<input
					type="button"
					class="btn btn-primary"
					value="Exchange"
					@click="exchange.sd.show = true"
				>
			</div>
		</div>
	</div>

	<!-- Help/Instructions modal -->
	<HelpModal
		v-if="showHelpModal"
		@close="showHelpModal=false"
	/>
	<!-- Legal -->
	<LegalModal
		v-if="showLegalModal"
		@close="showLegalModal=false"
	/>
	<!-- Refine UI -->
	<RefineUI v-if="sd.showRefine.value" />
	<!-- Inventory -->
	<Inventory v-if="sd.showInventory.value" />
	<!-- Marketplace -->
	<Exchange v-if="sd.showExchange.value" />
	<!-- Repair item info modal -->
	<RepairModal v-if="sd.showRepair.value" />

	<!-- Messaging system-->
	<Messaging />
</template>

<script>
import RepairModal from './components/RefineUI/RepairModal.vue'
import RefineUI from './components/RefineUI/RefineUI.vue'
import Inventory from './components/Inventory/Inventory.vue'
import Exchange from './components/Exchange/Exchange.vue'
import HelpModal from './components/HelpModal.vue'
import LegalModal from './components/LegalModal.vue'
import Messaging from './components/Messaging.vue'

import inventory from './functions/core/inventory'
import refine from './functions/core/refine'
import repair from './functions/core/repair'
import exchange from './functions/core/exchange'
import message from './functions/core/message'

import * as itemviewtable from './functions/itemviewtable'
import globalSd from './functions/globalsd'

import { provide,ref} from 'vue'

export default {
	components: { 
		RepairModal, RefineUI, Inventory, 
		Exchange, HelpModal, LegalModal,
		Messaging
	},
	
	setup() {
		provide('inventory', inventory)
		provide('refine', refine)
		provide('repair', repair)
		provide('itemviewtable', itemviewtable)
		provide('exchange', exchange)
		provide('messaging', message)

		return {
			inventory, refine, repair, exchange, message,
			sd: globalSd,
			showHelpModal: ref(false),
			showLegalModal: ref(false)
		}
	}
}
</script>

<style lang="scss">
@import "./scss/main.scss";

.main {
	background: linear-gradient(rgb(1, 99, 179), rgb(1, 27, 49));
	height: calc(100vh - 40px);
	width: calc(100vw);
	border-radius: 10px;
	border: none;
	position: relative;
	display: grid;

	.options {
		ul {
			position: absolute;
			top: 0;
			right: 0;
			list-style: none;
			padding: 0;
			margin: 0;
			

			li {
				display: inline-block;
				padding: 10px;
			}
		}
	}

	.zeny {
		position: absolute;
		font-size: 1.2rem;
		font-weight: bolder;
		padding: 10px;
		width: 220px;
		background: rgba(0, 0, 0, 0.548);
		color: white;
		margin: 10px;
		border-radius: 10px;

		&::after {
			position: absolute;
			background: url("./assets/itemviewtable/zeny-6.png") center no-repeat;
			background-size: 25px 25px;
			width: 25px;
			height: 25px;
			right: 10px;
			content: "";
		}
	}

	.holgrehenn-illust {
		// background: url("https://scontent.fymy1-2.fna.fbcdn.net/v/t1.0-9/s720x720/151666977_2795429900698644_7897028221993273984_o.jpg?_nc_cat=111&ccb=1-3&_nc_sid=110474&_nc_ohc=JOtlPMVLdSEAX_lYRIP&_nc_ht=scontent.fymy1-2.fna&tp=7&oh=c8cb17c97eff48ac2eb86a75d87d2cb4&oe=606D4631") no-repeat center;
		// background-blend-mode: multiply;
		// background-size: auto 100%;
		border-radius: 10px;
		box-shadow: 0 -5px 10px 0px rgba(0, 0, 0, 0.39);
		height: 600px;
		width: 100%;
		bottom: 0;
		position: absolute;
	}

	.game-main {
		position: absolute;
		background: rgba(0, 0, 0, 0.384);
		border-radius: 10px;
		top: 68px;
		height: calc(100% - 68px);
		width: calc(100% - 40px);
		padding: 20px;
		display: grid;
		align-items: center;
		justify-content: center;
		
		.actions {
			display: grid;
			grid-gap: 10px;
			align-items: center;
			min-width: 250px;
		}
	}
}
</style>