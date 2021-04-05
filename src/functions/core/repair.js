import { reactive } from 'vue'
import message from './message'

// State descriptor
const sd = reactive({
	materials: {},
	show: false
})

const clif_repair_item = (material, equip, inventory) => {
	delete inventory.itemlist[material.uid]
	equip.attribute = 0
	sd.show=false
	message.clif_add_message('<strong style="color: lightblue;">Repaired!</style>', 2000)
}

const clif_check_repair = (inventory, equip) => {
	sd.materials = {}
    
	for (let key in inventory.itemlist) {
		const ref = inventory.itemlist[key]

		// Same type but not the same equipment
		// Also no equipment above +5
		if (ref.uid === equip.uid) continue
		if (ref.refineCount > 5) continue
		if (ref.nameid !== equip.nameid) continue

		sd.materials[key] = ref
	}

	if (Object.keys(sd.materials).length) sd.show = true
}

export default {
	sd,
	start: clif_check_repair,
	repair: clif_repair_item,
}
