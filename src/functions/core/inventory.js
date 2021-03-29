import { reactive } from 'vue'
import * as itemdb from './itemdb'

const itemlist = reactive({})

const clif_add_item = (id='ancient-cape', qty=1, options={}) => {
	const result = itemdb.clif_instantiate_item(id, qty, options)
	if (!result) return

	// Add to inventory
	for (let key in result) itemlist[key] = result[key]
}

// Default items
clif_add_item(itemdb.ids.ANCIENT_CAPE, 2, {attribute: 1, refineCount: 4})
clif_add_item(itemdb.ids.CRITICAL_RING, 2)
clif_add_item(itemdb.ids.ZENY, 1000000)
clif_add_item(itemdb.ids.ELUNIUM, 10)
clif_add_item(itemdb.ids.ORIDECON, 10)

const inventoryState = {
	itemlist,
	addItem: clif_add_item
}

export default inventoryState