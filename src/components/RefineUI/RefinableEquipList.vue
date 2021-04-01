<template>
	<div class="equip-list">
		<ul>
			<li
				v-for="equip in refinable"
				:key="equip.nameid"
				:class="{broken:equip.attribute}"
				@click="$emit('select-equip', equip)"
			>
				<img :src="itemviewtable[equip.resourceviewid]">
				<span
					v-if="equip.refineCount"
					class="refine-count"
				>+{{ equip.refineCount }}</span><span
					class="equip-name"
				>{{ equip.name }}</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { computed } from 'vue'
import * as itemviewtable from '../../functions/itemviewtable'
const MAX_REFINE = 15

export default {
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
    font-size: 1.25rem;
    color: blue;
    background: #f5f5f5;
    color: rgb(0, 0, 0);
    padding: 20px;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            transition: all 0.1s ease;
            padding: 20px;
            background: white;
            border-radius: 20px;
            margin-bottom: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr 5fr;
            align-items: center;

            img {
                width: 35px;
            }
        }

        li:hover {
            background: rgb(255, 187, 0);
            transform: scale(1.05, 1.05);
        }
    }

    .refine-count {
        font-weight: bolder;
        padding: 5px;
    }

    .equip-name {
        padding: 5px;
    }

    .broken {
        color: red;
    }
}
</style>