<template>
	<div class="item-detail">
		<div class="item-image">
			<ItemThumb
				:item="item"
				:scale-on-hover="false"
				:large="true"
			/>
		</div>

		<div class="item-description">
			<p>
				{{ item.description }}
			</p>
			<p v-if="item.attribute">
				This item is broken.
			</p>
		</div>


		<div
			v-if="!item.currency"
			class="item-price"
		>
			<!-- <p>Exchange price:</p> -->
			<div>{{ exchange.clif_get_exchange_price(item) || 0 }}</div>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue'
import ItemThumb from './ItemThumb.vue'

export default {
	components: { ItemThumb },
	props: { item: { type: Object, default: () => {} }},
	setup() {
		return {
			itemviewtable: inject('itemviewtable'),
			inventory: inject('inventory'),
			exchange: inject('exchange')
		}
	}
}
</script>

<style lang="scss" scoped>
.item-detail {
	display: grid;
	// grid-template-columns: 100px auto;
	// grid-template-rows: auto auto;
	grid-template-areas: 	"image desc"
							"price price";

	grid-template-columns: 100px auto;
	grid-template-rows: auto auto;
	grid-gap: 10px;
	align-items: flex-start;
	justify-items: stretch;
	margin: 10px;

	background: linear-gradient(rgb(6, 30, 53), rgb(28, 57, 95));
	color: white;
	border-radius: 10px;
	padding: 10px;

	p{
		padding: 0;
		margin: 0;
	}

	.item-image {
		grid-area: image;
	}

	.item-description {
		grid-area: desc;
	}

	.item-price {
		grid-area: price;

		div {
			position: relative;
			padding-left: 25px;

			&::before {
				position: absolute;
				top: -5px;
				left: 10px;
				content: "";
				width: 65%;
				height: 20px;
				background: rgba(20, 94, 255, 0.24);
				padding: 5px;
				border-radius: 10px;
			}

			&::after {
				position: absolute;
				top: 0;
				left: 0;
				background: url("../../assets/itemviewtable/zeny-6.png") center no-repeat;
				background-size: 20px 20px;
				width: 20px;
				height: 20px;
				content: "";
			}
		}
	}
}
</style>