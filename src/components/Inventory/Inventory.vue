<template>
	<div
		class="inventory-modal"
		@click.self="inventory.sd.show=false"
	>
		<ul class="item-list">
			<li
				v-for="item in inventory.itemlist"
				:key="item.nameid"
				@click="inventory.sd.selectedItem = item"
			>
				<img :src="itemviewtable[item.resourceviewid]">
				<span
					v-if="item.stackable"
					class="qty"
				>{{ item.qty > 9999 ? '9999+' : item.qty }}</span>
				<span
					v-if="item.refineCount"
					class="refine-count"
					:class="{'refine-count__broken':item.attribute}"
				>+{{ item.refineCount }}</span>
				<img
					v-if="item.attribute"
					src="../../assets/hammer.svg"
					class="broken"
				>
			</li>
			<div class="inventory-title">
				Inventory
			</div>
			<img
				class="inventory-close"
				src="../../assets/back-button.svg"
				@click="inventory.sd.show=false"
			>
		</ul>
	</div>

	<ItemDetail
		v-if="inventory.sd.selectedItem.name"
		:item="inventory.sd.selectedItem"
	/>
</template>

<script>
import ItemDetail from './ItemDetail.vue'
import { inject } from 'vue'

export default {
	components: { ItemDetail },
	setup() {
		return {
			inventory: inject('inventory'),
			itemviewtable: inject('itemviewtable'),
		}
	}
}
</script>

<style lang="scss" scoped>

	.inventory-modal {
		font-family: 'Noto Sans JP', sans-serif;
		background: rgba(0, 0, 0, 0.644);
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: grid;
		align-content: center;
		justify-content: center;
	}

	.item-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(5, 50px);
		grid-gap: 5px;
		padding: 20px;
		background: linear-gradient(rgb(8, 177, 255), rgb(15, 120, 180));
		border-radius: 10px;
		max-width: 300px;
		overflow-y: scroll;
		box-shadow: 2px 2px 4px 0px rgba(5, 22, 37, 0.432);
		position: relative;
		padding-top: 60px;

		div.inventory-title {
			background: linear-gradient(rgb(255, 185, 54), rgb(255, 176, 28));
			position: absolute;
			right: 0;
			padding: 10px;
			width: 100%;
			text-align: center;
			border-radius: 10px;
			border-bottom-right-radius: 0;
			border-top-left-radius: 0;
		}

		img.inventory-close {
			width: 15px;
			position: absolute;
			top: 0;
			left: 0;
			padding: 11px;
			background: rgb(255, 217, 145);
			border-radius: 10px;
			border-bottom-left-radius: 0;
			border-top-right-radius: 0;

			&:hover {
				background: rgb(255, 249, 223);
				transition: all 0.2s;
				transform: scale(1.1, 1.1)
			}
		}

		li {
			background: linear-gradient(rgb(216, 240, 253), rgb(202, 231, 255));
			box-shadow: 0px 3px 5px 0px rgba(5, 22, 37, 0.432);

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 1px;
			border-radius: 10px;
			position: relative;
			height: 50px;
			transition: all 0.2s;

			&:hover{
				transform: scale(1.1,1.1);
			}

			img {
				max-height: 70%;
				max-width: 70%;
			}

			span.qty {
				position: absolute;
				right: 0;
				bottom: 0;
				color: white;
				background: rgba(0, 0, 0, 0.288);
				font-size: 0.85rem;
				padding: 1px;
				border-radius: 5px;
				max-width: 100%;
				overflow-x: hidden;
				text-overflow: ellipsis;
			}

			span.refine-count {
				position: absolute;
				top: 5px;
				right: 5px;
				background: rgba(14, 98, 255, 0.507);
				color: rgb(255, 255, 255);
				border-radius: 5px;
				padding: 1px;
				font-weight: 500;
				font-size: 0.85rem;

				&__broken {
					//background: rgba(255, 42, 14, 0.507);
					background: none;
					color: red;
					font-size: 0.7rem;
					padding: 2px;
				}
			}

			.broken {
				position: absolute;
				top: 5px;
				left: 5px;
				height: 20px;
				border: 1px solid rgba(255, 0, 0, 0.349);
				padding: 7.5px;
			}
		}
	}
</style>