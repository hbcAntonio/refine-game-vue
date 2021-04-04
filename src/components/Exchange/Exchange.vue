<template>
	<OverlayModalBase
		title="Exchange Place"
		@close="exchange.sd.show=false"
	>
		<div class="exchange-header">
			<div class="exchange-search">				
				<label
					for="search"
					:class="{empty: !!searchTerm}"
				>
					<input
						id="search"
						v-model="searchTerm"
						type="text"
						placeholder="Elunium..."
						:class="{content: !!searchTerm}"
					>
				</label>
			</div>
			
			<span class="exchange-zeny">
				<img :src="itemviewtable.zeny">
				<span>{{ inventory.zeny(undefined, false) }}</span>
			</span>
		</div>
		<ul class="exchange-itemlist">
			<li
				v-for="item in filteredItemList"
				:key="item.uid"
				@click="() => { exchange.sd.selectedItem=item; buyQty = 1 }"
			>
				<ItemThumb
					style="grid-area: image;"
					:item="item"
					:scale-on-hover="false"
				/>
				<span class="item-name">{{ item.name }}</span>
				<span class="item-price">{{ exchange.clif_get_exchange_price(item) }}</span>
			</li>
		</ul>

		
		<!-- <div
		class="exchange-modal"
		@click.self="exchange.sd.show=false"
	>
		<div class="exchange">
			
		</div>
	</div> -->
	</overlaymodalbase>

	<OverlayModalBase
		v-if="exchange.sd.selectedItem.name"
		:title="exchange.sd.selectedItem.name"
		:is-dialog="true"
		@close="exchange.sd.selectedItem={}"
	>
		<ItemThumb
			:item="exchange.sd.selectedItem"
			:scale-on-hover="false"
			:large="true"
		/>

		<p>{{ exchange.sd.selectedItem.description }}</p>
		<p v-if="exchange.sd.selectedItem.attribute">
			This item is broken.
		</p>

		<form
			novalidate
			@submit.prevent="showBuyConfirmDialog =true"
		>
			<input
				v-model="buyQty"
				type="number"
				:max="exchange.sd.selectedItem.qty > 9999 ? 9999 : exchange.sd.selectedItem.qty"
				min="1"
			>

			<input
				type="submit"
				value="Buy"
				:disabled="buyQty > exchange.sd.selectedItem.qty || buyQty < 0 || buyQty * exchange.clif_get_exchange_price(exchange.sd.selectedItem, true) > inventory.zeny() || buyQty == 0"
			>
		</form>
	</OverlayModalBase>

	<OverlayModalBase
		v-if="showBuyConfirmDialog"
		:is-dialog="true"
		title="Confirm"
		@close="showBuyConfirmDialog=false"
	>
		<p>Are you sure you want to proceed and buy <span><strong>{{ buyQty }}x {{ exchange.sd.selectedItem.name }}</strong></span>?</p>
		
		<input
			type="button"
			value="Cancel"
		>

		<input
			type="button"
			value="Purchase"
			@keypress.enter="buyItem"
			@click="buyItem"
		>
	</OverlayModalBase>
</template>

<script>
import OverlayModalBase from '../Modal/OverlayModalBase.vue'
import ItemThumb from '../Inventory/ItemThumb.vue'
import { inject, ref, computed } from 'vue'

export default {
	components: { OverlayModalBase, ItemThumb},
	setup() {
		const exchange = inject('exchange')
		const itemviewtable = inject('itemviewtable')
		const inventory = inject('inventory')
		const searchTerm = ref('')
		const showBuyConfirmDialog = ref(false)
		const buyQty = ref(1)
		const filteredItemList = computed(() => exchange.clif_filter_exchange(searchTerm.value))
		const showDialog = ref(false)
		
		return { 
			exchange, 
			itemviewtable, 
			inventory, 
			searchTerm, 
			filteredItemList,
			showDialog,
			showBuyConfirmDialog,
			buyQty,
		}
	},

	methods: {
		buyItem() {
			if (this.exchange.clif_buy_item(this.buyQty)) {
				this.showBuyConfirmDialog = false
				this.exchange.sd.selectedItem = {}
			}
				
		}
	}
}
</script> 

<style lang="scss">

.what-the-fuck {
	background: red;
	.modal-content {
		background: blue;
	}
}

.exchange-header {
	padding: 10px;
	background: white;
	border-radius: 10px;
	margin: 10px;
	//height: 12vh;
	display: grid;
	grid-template-columns: auto auto;
	align-items: center;

	.exchange-zeny {
		display: grid;
		grid-template-columns: 25px auto;
		padding: 10px;
		background: linear-gradient(rgb(92, 92, 92), rgb(43, 43, 43));
		color: white;
		font-weight: 800;
		border-radius: 10px;
		img {
			width: 20px;
		}
	}

	input[type="text"] {
		padding: 10px;
		border: 1px solid grey;
		border-radius: 10px;
		padding-left: 35px;
		width: 240px;

		&.content{
			padding: 10px;
		}
	}

	.exchange-search{
		label {
			position: relative;

			&.empty::before {
				transition: all 0.2s ease-in;
				width: 0px;
			}
		}

		label::before {
			transition: all 0.2s ease-in;
			content: "";
			background: url("../../assets/magnifier.svg") center / contain no-repeat;
			width: 20px;
			height: 20px;
			position: absolute;
			top: 2.5px;
			left: 10px;
		}
	}
}

ul.exchange-itemlist {
	padding: 0;
	margin: 10px;
	list-style: none;
	display: grid;
	grid-gap: 5px;
	grid-template-columns: auto auto;
	overflow-y: scroll;
	overflow-x: hidden;
	max-height: 60vh;
	background: linear-gradient(rgb(255, 255, 255), rgba(228, 228, 228, 0.966));
	border-radius: 10px;
	padding: 10px;

	li {
		background: linear-gradient(white, rgb(241, 241, 241));
		margin: 1px;
		padding: 10px;
		display: grid;
		grid-template-columns: 50px auto;
		grid-gap: 5px 5px;
		grid-template-areas: 	"image name"
								"image price";

		border: 1px solid rgb(180, 180, 180);
		border-radius: 10px;

		&:hover {
			transition: all 0.1s ease-in;
			transform:scale(1.025, 1.025);
		}

		span {
			display: inline-block;

			&.item-price {
				grid-area: price;
				position: relative;
				padding-left: 65px;

				&::after {
					position: absolute;
					top: 0;
					left: 0;
					content: 'Price';
					color: grey;
					background: black;
					background: url("../../assets/itemviewtable/zeny-6.png") no-repeat;
					background-size: 20px 20px;
					background-position: 40px 0px;
					width: 100px;
					height: 50px;
				}

				&::before {
					content: '';
					position: absolute;
					top: -2.5px;
					left: 50px;
					background: rgba(48, 131, 255, 0.466);
					width: 120px;
					height: 15px;
					padding: 5px;
					border-radius: 10px;
				}
			}

			&.item-name {
				grid-area: name;
			}
		}
	}
}
</style>