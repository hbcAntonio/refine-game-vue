import { reactive } from 'vue'

// State descriptor
const sd = reactive({
	materials: {},
	show: false
})

const clif_repair_item = (material, equip, inventory) => {
	delete inventory.itemlist[material.uid]
	equip.attribute = 0
	sd.show=false
}

const clif_check_repair = (inventory, equip) => {
	console.log('clif_check_repair', inventory.itemlist)
	sd.materials = {}
    
	for (let key in inventory.itemlist) {
		const ref = inventory.itemlist[key]

		// Same type but not the same equipment
		if (ref.uid !== equip.uid && ref.nameid === equip.nameid) {
			sd.materials[key] = ref
		}
	}

	console.log(sd.materials)

	if (Object.keys(sd.materials).length) sd.show = true
}

export default {
	sd,
	start: clif_check_repair,
	repair: clif_repair_item,
}
