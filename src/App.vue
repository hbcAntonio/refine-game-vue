<template>
	<!-- <div
		class="inputs"
		style="display:grid"
	>
		<input
			type="button"
			:value="`show repair modal: ${sd.showRepair.value}`"
			@click="sd.showRepair.value = true"
		>

		<input
			type="button"
			:value="`show inventory modal: ${sd.showInventory.value}`"
			@click="inventory.sd.show = true"
		>

		<input
			type="button"
			:value="`show exchange modal: ${sd.showExchange.value}`"
			@click="exchange.sd.show = true"
		>
	</div> -->

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

	<!-- Help Modal -->
	<OverlayModalBase
		v-if="showHelpModal"
		title="Help"
		:is-dialog="true"
		@close="showHelpModal=false"
	>
		<div
			class="help-text"
			style="padding: 20px"
		>
			Here's how you play the game:
			<p>Your goal is to make as much money as possible before running out of possiblities to "refine" your items.</p>
			<p>The higher the item refine level, the more money it's worth!</p>
			<p>
				Items require specific materials. Some require <strong>Elunium</strong>, some require <strong>Oridecon</strong>. The further you are into the refine process, all the way up to the <strong>max of +15</strong>, the <strong>more expensive refining gets</strong>.
			</p><p>
				During the process, you migh <strong>break</strong> items. That deeply affects the <strong>sell</strong> value and <strong>items cannot be upgraded while broken.</strong>
			</p><p>
				In order to <strong>repair a broken item</strong> you must use a material which refine level is <strong>+5 or below</strong>.
			</p>
			<p>The success chance changes over time! Does it pay to be greedy?</p>
		</div>
	</OverlayModalBase>

	<!-- Refine UI -->
	<RefineUI v-if="sd.showRefine.value" />
	<!-- Inventory -->
	<Inventory v-if="sd.showInventory.value" />
	<!-- Marketplace -->
	<Exchange v-if="sd.showExchange.value" />
	<!-- Repair item info modal -->
	<RepairModal v-if="sd.showRepair.value" />

	<!-- Messaging system-->
	<div
		v-if="Object.values(message.sd.messages).length > 0"
		class="messaging"
	>
		<div class="container">
			<div
				v-for="(message, index) in message.sd.messages"
				:id="index"
				:key="index"
				class="message"
				v-html="message"
			/>
		</div>
	</div>
</template>

<script>
import RepairModal from './components/RefineUI/RepairModal.vue'
import RefineUI from './components/RefineUI/RefineUI.vue'
import Inventory from './components/Inventory/Inventory.vue'
import Exchange from './components/Exchange/Exchange.vue'
import OverlayModalBase from './components/Modal/OverlayModalBase.vue'

import inventory from './functions/core/inventory'
import refine from './functions/core/refine'
import repair from './functions/core/repair'
import exchange from './functions/core/exchange'
import message from './functions/core/message'

import * as itemviewtable from './functions/itemviewtable'
import globalSd from './functions/globalsd'

import { provide,ref} from 'vue'

export default {
	components: { RepairModal, RefineUI, Inventory, Exchange, OverlayModalBase},
	setup() {
		provide('inventory', inventory)
		provide('refine', refine)
		provide('repair', repair)
		provide('itemviewtable', itemviewtable)
		provide('exchange', exchange)
		provide('messages', message)

		return {
			inventory, refine, repair, exchange, message,
			sd: globalSd,
			showHelpModal: ref(false),
		}
	}
}
</script>

<style lang="scss">
@import "./scss/main.scss";

.messaging {
	position: absolute;
	top: 0;
	left: 0;
	display: grid;
	align-items: center;
	justify-items: center;
	width: 100vw;
	height: 100vh;
	background: rgba(0,0,0,0.5);
	color: white;
	font-weight: bolder;

	.container {
		display: grid;
	}

	.message {
		background: rgba(0,0,0,0.9);
		padding: 10px;
		border-radius:10px;
		animation: floatup 2s;
		max-height: 50px;

		@keyframes floatup {
			0% {
				transform: scale(0,0);
			}
			25% {
				transform: scale(1.2,1.2);
				opacity: 1;
			}
			100% {
				transform: translate(0, -50px);
				opacity: 0;
			}
		}

		@media screen and (max-width: 700px) {
			@keyframes floatup {
				0% {
					transform: scale(0,0);
				}
				25% {
					transform: scale(1.2,1.2);
					opacity: 1;
				}
				100% {
					//transform: translate(0, -50px);
					opacity: 0;
				}
			}
		}
	}
}

.help-text {
	color: rgb(32, 32, 11);

	strong {
		font-size: 1.0rem;
		color: black;
		text-decoration: underline;
	}
}

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
		width: 250px;
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
		background: url("https://scontent.fymy1-2.fna.fbcdn.net/v/t1.0-9/s720x720/151666977_2795429900698644_7897028221993273984_o.jpg?_nc_cat=111&ccb=1-3&_nc_sid=110474&_nc_ohc=JOtlPMVLdSEAX_lYRIP&_nc_ht=scontent.fymy1-2.fna&tp=7&oh=c8cb17c97eff48ac2eb86a75d87d2cb4&oe=606D4631") no-repeat center;
		background-blend-mode: multiply;
		background-size: auto 100%;
		border-radius: 10px;
		box-shadow: 0 -5px 10px 0px rgba(0, 0, 0, 0.39);
		height: 600px;
		width: 100%;
		bottom: 0;
		position: absolute;
		// img {
		// 	position: absolute;
		// 	left: -50%;
		// 	top: -10px;
		// 	height: 100vh;
		// 	mix-blend-mode: multiply;
		// }
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