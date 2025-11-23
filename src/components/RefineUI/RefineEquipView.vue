<template>
	<div
		v-if="equip.name"
		class="selected-equip"
		:class="{'broken': equip.attribute}"
	>
		<div class="img-container">
			<img :src="itemviewtable[equip.resourceviewid]">
			<div class="item-name">
				<span
					v-if="equip.refineCount"
					class="refine-count"
				>+{{ equip.refineCount }}</span><span
					class="equip-name"
				>&nbsp;{{ equip.name }}</span>
			</div>
		</div>
		
		<div class="item-name">
			<span
				v-if="equip.refineCount"
				class="refine-count"
			>+{{ equip.refineCount }}</span><span
				class="equip-name"
			>&nbsp;{{ equip.name }}</span>
		</div>
		

		<!-- requirements -->
		<div
			v-if="!equip.attribute"
			class="requirements"
		>
			<div><img :src="itemviewtable['zeny']">Zeny x{{ reqs.zeny }}</div>
		</div>

		<div
			v-if="equip.attribute"
			class="requirements"
		>
			<div>
			<img :src="itemviewtable[equip.resourceviewid]">
			{{ equip.name }} materials worth {{ repairPoints }} {{ repairPoints === 1 ? 'point' : 'points' }}
		</div>
		</div>
	</div>
</template>

<script>
import * as itemviewtable from '../../functions/itemviewtable.js'
import inventory from '../../functions/core/inventory'
import repair from '../../functions/core/repair'
import { computed } from 'vue'

export default {
	props: {
		equip: { type: Object, default: () => {} },
		reqs: { type: Object, default: () => {} }
	},
	emits: ['repair'],
	setup(props) {
		const repairPoints = computed(() => {
			return props.equip.attribute ? repair.getRequiredPoints(props.equip) : 0
		})

		return { itemviewtable, inventory, repairPoints }
	}
}
</script>

<style lang="scss" scoped>
.selected-equip {
	padding: 20px;
	background: rgba(0, 0, 0, 0.418);
	border-radius: 10px;
	display: grid;
	align-items: center;
	justify-items: center;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	.img-container{
		padding: 20px;
		border-radius: 10px;
		background: linear-gradient(white, rgb(224, 224, 224));
		color: black;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

		img {
			transition: all 0.3s ease;
		}

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

			img {
				transform: scale(1.05);
			}
		}

		.item-name {
			display: none;
		}
	}
	
	.item-name {
		padding: 5px;
	}

	.requirements {
		padding: 10px;
		border-radius: 10px;
		background: linear-gradient(white, rgb(224, 224, 224));
		color: black;
		position: relative;
		padding-top: 30px;
		width: 85%;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		animation: slideInUp 0.4s ease-out;

		@keyframes slideInUp {
			from {
				opacity: 0;
				transform: translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		img {
			max-width: 25px;
			position: absolute;
			left: 5px;
		}

		div {
			padding: 5px;
			padding-left: 25px;
		}

		&::before {
			content: 'Requirements';
			position: absolute;
			top: 0;
			left: -2.5px;
			background: black;
			color: white;
			border-radius: 10px;
			padding: 6px;
			box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.301);
			transition: all 0.3s ease;
		}

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

			&::before {
				box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.4);
			}
		}
	}

	&.broken {
		background: rgba(255, 0, 0, 0.301);
		animation: shake 0.5s ease-in-out;

		@keyframes shake {
			0%, 100% { transform: translateX(0); }
			10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
			20%, 40%, 60%, 80% { transform: translateX(5px); }
		}

		.img-container {
			background: linear-gradient(rgba(255, 0, 0, 0.4), rgba(200, 0, 0, 0.5));
			animation: pulse 2s infinite;

			@keyframes pulse {
				0%, 100% {
					opacity: 1;
				}
				50% {
					opacity: 0.7;
				}
			}
		}
	}

	@media screen and (max-width: 700px) {
		grid-template-columns: auto auto auto;
		max-width: 320px;
		overflow: hidden;

		.img-container {
			text-align: center;
			padding: 5px;
			margin: 5px;
			.item-name {
				display: block;
			}
		}

		.item-name {
			display: none;
		}
	}
}
</style>