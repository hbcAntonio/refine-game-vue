import { reactive } from 'vue'

const sd = reactive({
	materials: {},
	show: false
})

const clif_repair_item = (inventory, equip) => {
	delete inventory.itemlist[equip.uid]
	equip.attribute = 0
	sd.show=false
}


const clif_check_repair = (inventory, equip) => {
	sd.materials = {}
    
	for (let key in inventory.itemlist) {
		const ref = inventory.itemlist[key]

		// Same type but not the same equipment
		if (ref.uid !== equip.uid && ref.nameid === equip.nameid) {
			sd.materials[key] = ref
		}
	}

	if (Object.keys(sd.materials).length) sd.show = true
}

const repairState = {
	start: clif_check_repair,
	repair: clif_repair_item,
	sd
}

export default repairState
