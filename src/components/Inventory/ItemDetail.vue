<template>
	<div
		class="item-detail-modal"
		@click.self="inventory.sd.selectedItem = {}"
	>
		<div class="container">
			<div class="title">
				{{ item.name }}
			</div>
			<div class="content">
				<div class="image">
					<img :src="itemviewtable[item.resourceviewid]">
					<span
						v-if="item.refineCount"
						:class="{broken:item.attribute}"
					>+{{ item.refineCount }}</span>
				</div>
				<div class="description">
					<p>{{ item.description }}</p>
					<p v-if="item.refineCount">
						Equipment refine: +{{ item.refineCount }}
					</p>

					<p
						v-if="item.attribute"
						class="broken"
					>
						This item is broken and needs to be repaired before being refined any further!
					</p>
					<p>Exchange price: {{ exchange.clif_get_exchange_price(item) || 0 }}Z</p>
					<input
						type="button"
						value="-"
						@click="item.refineCount--"
					>
					<input
						type="button"
						value="+"
						@click="item.refineCount++"
					>
					<input
						type="button"
						value="!"
						@click="item.attribute ? item.attribute = 0 : item.attribute = 1"
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue'
export default {
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
	.item-detail-modal {
		background: rgba(0, 0, 0, 0.74);
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: grid;
		align-items: center;
		justify-items: center;

		.container {
			background: linear-gradient(rgb(255, 255, 255), rgb(226, 236, 255));
			box-shadow: 0px 3px 10px 0px black;
			color: black;
			border-radius: 10px;
			display: grid;
			margin: 5px;


			.title {
				background: linear-gradient(rgb(255, 185, 54), rgb(255, 176, 28));
				padding: 10px;
				text-align: center;
				font-weight: 800;
				font-size: 1.1rem;
				text-transform: uppercase;
				border-radius: 10px;
				border-bottom-right-radius: 0;
				border-bottom-left-radius: 0;
			}

			.content {
				padding: 10px;
				display: grid;
				align-items: center;
				justify-items: center;
				.image {
					position: relative;
					span {
						background: rgba(14, 98, 255, 0.507);
						color: rgb(255, 255, 255);
						border-radius: 10px;
						position: absolute;
						top: 0;
						right: 0;
						padding: 2px;
					}

					span.broken {
						color: red;
						background: rgba(255, 0, 0, 0.247);
					}
				}

				p.broken {
					color: rgb(196, 0, 0);
				}

				img {
					width: 50px;
					border: 1px solid rgba(0, 0, 0, 0.185);
					padding: 10px;
					border-radius: 10px;
					box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.24);
				}

				p {
					max-width: 200px;
					text-align: center;
					font-size: .9rem;
				}
			}
		}
	}
	
</style>