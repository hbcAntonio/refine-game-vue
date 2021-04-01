<template>
	Oridecon: {{ oridecon.qty }}
	Elunium: {{ elunium.qty }}
	Zeny: {{ zeny.qty }}
</template>

<script>
import inventoryState from '../../functions/core/inventory'
export default {
	props: { inventory: {type:Object, default: () => inventoryState}},
	setup(props) {
		return {
			oridecon: props.inventory.findItem('oridecon')[0],
			elunium: props.inventory.findItem('elunium')[0],
			zeny: props.inventory.findItem('zeny')[0]
		}
	}
}
</script>