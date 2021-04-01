import { computed } from 'vue'
import repair from './core/repair'
import inventory from './core/inventory'
import refine from './core/refine'

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

	showInventory: computed({
		get: () => inventory.sd.show,
		set: (value) => inventory.sd.show = value
	})
}