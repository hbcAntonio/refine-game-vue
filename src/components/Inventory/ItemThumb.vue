<template>
	<div
		class="item-thumb"
		:class="{'scale-on-hover': scaleOnHover, 'item-thumb__large': large}"
	>
		<img :src="itemviewtable[item.resourceviewid]">
		<span
			
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
	</div>
</template>

<script>
import { inject } from 'vue'
export default {
	props: {
		item: { type: Object, default: () => {} },
		scaleOnHover: { type: Boolean, default: true },
		large: { type: Boolean, default: false }
	},
	setup() {
		return { itemviewtable: inject('itemviewtable')}
	}
}
</script>

<style lang="scss" scoped>
.item-thumb {
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

	&.scale-on-hover:hover{
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

	&__large{
		height: 100px;
		max-width: 100px;

		background: linear-gradient(rgb(224, 244, 255), rgb(193, 227, 255));
		border: 1px solid rgb(68, 92, 124);
		box-shadow: none;

		span.refine-count {
			padding: 5px;
			font-size: 1rem;

			&__broken {
				background: rgb(255, 163, 163);
			}
		}

		.broken {
			height: 100px;
			opacity: 0.25;
		}
	}

}
</style>