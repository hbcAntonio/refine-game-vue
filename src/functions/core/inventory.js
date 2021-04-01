import { reactive } from 'vue'
import * as itemdb from './itemdb'

const itemlist = reactive({})
const sd = reactive({
	show: true,
	selectedItem: {}
})

const clif_get_item_info = (id='ancient-cape') => {
	return itemdb.db[id] || { name: 'apple', qty: 1, refineCount: 0, stackable: true}
}

const clif_add_item = (id='ancient-cape', qty=1, options={}) => {
	const result = itemdb.clif_instantiate_item(id, qty, options)
	if (!result) return

	// Add to inventory
	for (let key in result) itemlist[key] = result[key]
}

const clif_find_item = (nameid='oridecon') => {
	return Object.values(itemlist).filter(item => item.nameid === nameid)
}

const clif_find_currency = (nameid='zeny') => {
	return clif_find_item(nameid)[0].qty
}

const clif_del_item = (nameid='oridecon', qty=1) => {
	Object.values(itemlist).filter(item => nameid === item.nameid).forEach(item => {
		if (item.stackable) item.qty -= qty
		if ((item.qty <= 0 || !item.stackable) && !item.currency) delete itemlist[item.uid]
		if (item.currency) item.qty = item.qty <= 0 ? 0 : item.qty
	})
}

// Default items
clif_add_item(itemdb.ids.ZENY, 10000000)
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 7, attribute: 1})
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 4, attribute: 1})
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 15, attribute: 0})
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 3, attribute: 1})
clif_add_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 4, attribute: 1})
clif_add_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 9, attribute: 0})
clif_add_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 15, attribute: 0})
clif_add_item(itemdb.ids.ELUNIUM, 100)
clif_add_item(itemdb.ids.ORIDECON, 100)

export default {
	itemlist, // separate from state descriptor -- unity them? TODO:
	sd,
	addItem: clif_add_item,
	findItem: clif_find_item,
	delItem: clif_del_item,
	itemInfo: clif_get_item_info,
	zeny: clif_find_currency
}