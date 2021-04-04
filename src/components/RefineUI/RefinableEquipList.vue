<template>
	<div class="equip-list">
		<ul>
			Please select an item to refine. Max refine is +15. Have fun!
			<li
				v-for="equip in refinable"
				:key="equip.nameid"
				:class="{broken:equip.attribute}"
				@click="$emit('select-equip', equip)"
			>
				<ItemThumb :item="equip" />
				<div>{{ equip.name }}</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { computed } from 'vue'
import * as itemviewtable from '../../functions/itemviewtable'
import ItemThumb from '../Inventory/ItemThumb.vue'
const MAX_REFINE = 15

export default {
	components: { ItemThumb},
	props: { inventory: { type: Object, default: () => {} } },
	emits: ['select-equip'],

	setup(props) {
		return {
			refinable: computed(() => {
				const result = {}
				for (let key in props.inventory.itemlist) {
					if (!props.inventory.itemlist[key].equipment) continue
					if (props.inventory.itemlist[key].refineCount >= MAX_REFINE) continue
					result[key] = props.inventory.itemlist[key]
				}
				return result
			}),
			itemviewtable,
		}
	}
}
</script>

<style lang="scss">
.equip-list {
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-gap: 10px;
        overflow-y: scroll;
        padding: 10px;
        background: rgba(0, 0, 0, 0.39);
        border-radius: 10px;
        color: white;
        max-height: 470px;

        li {
            display: grid;
            grid-template-columns: 50px auto;
            align-items: center;
            grid-gap: 10px;
            background: linear-gradient(rgb(255, 255, 255), rgb(214, 214, 214));
            border-radius: 10px;
            padding: 4px;
            color: black;
            transition: all 0.1s ease-in;

            &:hover {
                transform: scale(1.1, 1.1);
            }
        }
    }
    .broken {
        color: red;
    }
}
</style>