import { reactive } from 'vue'
import message from './message'

// State descriptor
const sd = reactive({
	materials: {},
	selectedMaterials: [],
	brokenEquip: null,
	show: false
})

// Calculate the "point value" of an item for repair
const getItemPoints = (item) => {
	// Non-broken items are worth 1 point
	// Broken items are worth their refineCount in points
	return item.attribute ? item.refineCount : 1
}

// Calculate required points to repair an item
const getRequiredPoints = (equip) => {
	// Items broken at ≤+6: need 1 point
	// Items broken at >+6: need refineCount points
	return equip.refineCount <= 6 ? 1 : equip.refineCount
}

// Calculate total points from selected materials
const getSelectedPoints = () => {
	return sd.selectedMaterials.reduce((total, mat) => total + getItemPoints(mat), 0)
}

const clif_repair_item = (materials, equip, inventory) => {
	// Delete all selected materials from inventory
	materials.forEach(material => {
		delete inventory.itemlist[material.uid]
	})

	equip.attribute = 0
	sd.show = false
	sd.selectedMaterials = []
	message.clif_add_message('<strong style="color: lightblue;">Repaired!</style>', 2000)
}

const clif_check_repair = (inventory, equip) => {
	sd.materials = {}
	sd.selectedMaterials = []
	sd.brokenEquip = equip

	for (let key in inventory.itemlist) {
		const ref = inventory.itemlist[key]

		// Same type but not the same equipment
		if (ref.uid === equip.uid) continue
		if (ref.nameid !== equip.nameid) continue

		// For items broken at ≤+6: accept non-broken items or broken items <+6
		// For items broken at >+6: accept any item of the same type
		if (equip.refineCount <= 6) {
			// Only allow non-broken or broken items with refineCount < 6
			if (ref.attribute && ref.refineCount >= 6) continue
		}

		sd.materials[key] = ref
	}

	if (Object.keys(sd.materials).length) sd.show = true
}

export default {
	sd,
	start: clif_check_repair,
	repair: clif_repair_item,
	getItemPoints,
	getRequiredPoints,
	getSelectedPoints
}
