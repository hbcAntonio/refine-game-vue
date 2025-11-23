import { reactive } from 'vue'
import type { Equipment, RepairState } from '../../types'
import message from './message'
import type inventoryState from './inventory'

// State descriptor
const sd = reactive<RepairState>({
  materials: {},
  selectedMaterials: [],
  brokenEquip: null,
  show: false
})

// Check if an item uses the points system for repair
const usesPointSystem = (equip: Equipment): boolean => {
  // Items at +6 and above use points system
  return equip.refineCount >= 6
}

// Calculate the "point value" of an item for repair
const getItemPoints = (item: Equipment): number => {
  // All items are worth their refineCount in points (minimum 1)
  return Math.max(1, item.refineCount)
}

// Calculate required points to repair an item
const getRequiredPoints = (equip: Equipment): number => {
  if (!usesPointSystem(equip)) {
    // Items below +6 don't use points system
    return 0
  }
  // Items at +6 and above need refineCount points
  return equip.refineCount
}

// Calculate total points from selected materials
const getSelectedPoints = (): number => {
  return sd.selectedMaterials.reduce((total, mat) => total + getItemPoints(mat), 0)
}

const clif_repair_item = (
  materials: Equipment[],
  equip: Partial<Equipment>,
  inventory: typeof inventoryState
): void => {
  // Delete all selected materials from inventory
  materials.forEach(material => {
    delete inventory.itemlist[material.uid]
  })

  equip.attribute = 0
  sd.show = false
  sd.selectedMaterials = []
  message.clif_add_message('<strong style="color: lightblue;">Repaired!</style>', 2000)
}

const clif_check_repair = (inventory: typeof inventoryState, equip: Equipment): void => {
  sd.materials = {}
  sd.selectedMaterials = []
  sd.brokenEquip = equip

  for (const key in inventory.itemlist) {
    const ref = inventory.itemlist[key]

    // Same type but not the same equipment
    if (ref.uid === equip.uid) continue
    if (ref.nameid !== equip.nameid) continue

    if (!usesPointSystem(equip)) {
      // For items below +6: only accept non-broken items or broken items <+6
      if (ref.attribute && ref.refineCount >= 6) continue
    }
    // For items at +6 and above: accept any item of the same type

    sd.materials[key] = ref
  }

  if (Object.keys(sd.materials).length) {
    sd.show = true
  } else {
    message.clif_add_message('<strong style="color: orange;">No suitable materials found for repair!</strong>', 2000)
  }
}

export default {
  sd,
  start: clif_check_repair,
  repair: clif_repair_item,
  usesPointSystem,
  getItemPoints,
  getRequiredPoints,
  getSelectedPoints
}
