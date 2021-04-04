<template>
	<div
		v-if="equip.name"
		class="selected-equip"
		:class="{'broken': equip.attribute}"
	>
		<div class="img-container">
			<img :src="itemviewtable[equip.resourceviewid]">
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
			<div><img :src="itemviewtable[reqs.mat]">{{ inventory.itemInfo(reqs.mat).name }} x1</div>
		</div>

		<div
			v-if="equip.attribute"
			class="requirements"
		>
			<div><img :src="itemviewtable[equip.resourceviewid]"> {{ equip.name }} x1</div>
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

<style lang="scss" scoped>
.selected-equip {
	padding: 20px;
	background: rgba(0, 0, 0, 0.418);
	border-radius: 10px;
	display: grid;
	align-items: center;
	justify-items: center;

	.img-container{
		padding: 20px;
		border-radius: 10px;
		background: white;
		color: black;
	}
	
	.item-name {
		padding: 5px;
	}

	.requirements {
		padding: 10px;
		border-radius: 10px;
		background: white;
		color: black;
		position: relative;
		padding-top: 30px;
		width: 85%;

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
		}
	}

	&.broken {
		background: rgba(255, 0, 0, 0.301);

		.img-container {
			background: rgba(255, 0, 0, 0.315);
		}
	}
}
</style>