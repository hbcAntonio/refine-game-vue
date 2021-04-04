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
				<ItemThumb :item="item" />
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

	<OverlayModalBase
		v-if="inventory.sd.selectedItem.name"
		:title="inventory.sd.selectedItem.name"
		:is-dialog="true"
		@close="inventory.sd.selectedItem={}"
	>
		<ItemDetail :item="inventory.sd.selectedItem" />

		<!-- Selling -->
		<input
			v-if="!inventory.sd.selectedItem.currency"
			type="button"
			value="Sell"
			class="btn btn-primary btn-sell"
			@click="showSellConfirmDialog=true"
		>
	</OverlayModalBase>

	<OverlayModalBase
		v-if="showSellConfirmDialog"
		:is-dialog="true"
		title="Confirm"
		@close="showSellConfirmDialog=false"
	>
		<div class="confirm-sell-dialog">
			<p>Are you sure you want to sell <span>{{ inventory.sd.selectedItem.name }} x1</span>?</p>
			<input
				type="button"
				value="Cancel"
				class="btn btn-cancel"
				@click="showSellConfirmDialog=false"
			>
			<input
				type="button"
				value="Sell"
				class="btn btn-primary"
				@click="sellItem"
			>
		</div>
	</OverlayModalBase>
</template>

<script>
import ItemDetail from './ItemDetail.vue'
import ItemThumb from './ItemThumb.vue'
import OverlayModalBase from '../Modal/OverlayModalBase.vue'
import { inject, ref } from 'vue'

export default {
	components: { ItemDetail, ItemThumb, OverlayModalBase },
	setup() {
		return {
			inventory: inject('inventory'),
			itemviewtable: inject('itemviewtable'),
			showSellConfirmDialog: ref(false)
		}
	},
	methods: {
		sellItem() {
			this.inventory.sellItem()
			this.showSellConfirmDialog = false
		}
	}
}
</script>

<style lang="scss" scoped>

.confirm-sell-dialog {
	padding: 10px;
	margin: 10px;
	background: rgba(0, 0, 0, 0.514);
	border-radius: 10px;
	display: grid;
	color: white;
	grid-gap: 10px;

	span {
		color: rgb(102, 199, 255);
	}
}
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

		
	}
</style>