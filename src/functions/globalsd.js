import { computed } from 'vue'

import repair from './core/repair'
import inventory from './core/inventory'
import refine from './core/refine'
import exchange from './core/exchange'

export default {
	showRepair: computed({
		get: () => repair.sd.show,
		set: (value) => {
			if (!refine.sd.equip.attribute) {
				console.warn('current selected equip is not BROKEN')
				repair.sd.show = false
				return
			}

			repair.sd.show = value
		}
	}),

	showInventory: computed(() => inventory.sd.show),
	showExchange: computed(() => exchange.sd.show),
	showRefine: computed(() => refine.sd.show)
}