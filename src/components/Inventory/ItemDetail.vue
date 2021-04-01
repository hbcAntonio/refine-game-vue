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
					<p>Exchange price: {{ formatter.format(price) || 0 }}Z</p>
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
			formatter: new Intl.NumberFormat('en-US', {
				// style: 'currency',
				// currency: 'USD',
				// signDisplay: 'never'
				// These options are needed to round to whole numbers if that's what you want.
				//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
				//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
			})
		}
	},
	computed: {
		price() { 
			const basePrice = this.item.basePrice
			if (this.item.currency) return

			if (!this.item.equipment) return basePrice
			
			const refineCount = this.item.refineCount
			const oriPrice = 25000

			const guesworktable = [
				basePrice,
				basePrice + oriPrice + 10000,
				basePrice + oriPrice * 2 + 20000 + 10000,
				basePrice + oriPrice * 3 + 30000 + 20000 + 10000,
				basePrice + oriPrice * 4 + 40000 + 30000 + 20000 + 10000,
				basePrice + oriPrice * 5 + 50000 + 40000 + 30000 + 20000 + 10000,
				basePrice * (2) + oriPrice * 6 + 60000 + 50000 + 100000,
				basePrice * (2+3) + oriPrice * 7 + 70000 + 60000 + 50000 + 100000,
				basePrice * (2+3+4) + oriPrice * 8 + 80000 + 70000 + 60000 + 50000 + 100000,
				basePrice * (2+3+4+5) + oriPrice * 10 + 90000 + 80000 + 70000 + 60000 + 50000 + 100000,
				basePrice * (2+3+4+5+6+7) + (25000 * 10) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 1.5 * (2+3+4+5+6+7) + (125000) + (25000 * 11) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 2.5 * (2+3+4+5+6+7+8) + (125000 * 2) + (25000 * 12) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 3.5 * (2+3+4+5+6+7+8*2) + (125000 * 3) + (25000 * 13) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 4.5 * (2+3+4+5+6+7+8*3) + (125000 * 4) + (25000 * 14) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 10 * (2+3+4+5+6+7+8*4) + (125000 * 5) + (25000 * 15) + 190000 + 80000 + 70000 + 11000 + 100000
			]

			const guessworktable_broken = [
				0,
				0,
				0,
				0.5 * basePrice + oriPrice * 3 + 30000 + 20000 + 10000,
				basePrice + oriPrice * 4 + 40000 + 30000 + 20000 + 10000,
				basePrice + oriPrice * 5 + 50000 + 40000 + 30000 + 20000 + 10000,
				basePrice * (2) + oriPrice * 6 + 60000 + 50000 + 100000,
				basePrice * (2+3) + oriPrice * 7 + 70000 + 60000 + 50000 + 100000,
				basePrice * (2+3+4) + oriPrice * 8 + 80000 + 70000 + 60000 + 50000 + 100000,
				basePrice * (2+3+4+5) + oriPrice * 10 + 90000 + 80000 + 70000 + 60000 + 50000 + 100000,
				basePrice * (2+3+4+5+6+7) + (25000 * 10) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 1.5 * (2+3+4+5+6+7) + (125000) + (25000 * 11) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 2.5 * (2+3+4+5+6+7+8) + (125000 * 2) + (25000 * 12) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 3.5 * (2+3+4+5+6+7+8*2) + (125000 * 3) + (25000 * 13) + 190000 + 80000 + 70000 + 11000 + 100000,
				basePrice * 4.5 * (2+3+4+5+6+7+8*3) + (125000 * 4) + (25000 * 14) + 190000 + 80000 + 70000 + 11000 + 100000,
				0
			]

			return this.item.attribute === 1 ? guessworktable_broken[refineCount] : guesworktable[refineCount]
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