import { reactive } from 'vue'
import * as itemdb from './itemdb'

const itemlist = reactive({})
const sd = reactive({
	show: true,
	selectedItem: {}
})

const formatter = new Intl.NumberFormat('en-US', {
	// style: 'currency',
	// currency: 'USD',
	// signDisplay: 'never'
	// These options are needed to round to whole numbers if that's what you want.
	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})



const clif_get_item_info = (id='ancient-cape') => {
	return itemdb.db[id] || { name: 'apple', qty: 1, refineCount: 0, stackable: true}
}

const clif_find_item = (nameid='oridecon') => {
	return Object.values(itemlist).filter(item => item.nameid === nameid)
}

const clif_find_currency = (nameid='zeny', raw=true) => {
	const curr = clif_find_item(nameid)[0].qty
	return raw ? curr : formatter.format(curr)
}

const clif_add_item = (id='ancient-cape', qty=1, options={}) => {

	// Clear some options first
	// Stackable in exchange, not in inventory
	if (options.equipment) options.stackable = false
	// Maybe we're duplicating an item, make sure
	// that the new instance does not have the same uid
	if (options.uid) delete options.uid

	// Is this a stackable item?
	if (itemdb.db[id]?.stackable) {
		// Find item first to add to the stack instead
		// of creating a new instance
		const items = clif_find_item(id)
		if (items[0] && items[0].stackable) {
			itemlist[items[0].uid].qty += qty
			const _options = {...options}
			delete _options.qty // just in case
			if (_options.equipment) delete _options.stackable
			itemlist[items[0].uid] = {...itemlist[items[0].uid], ..._options}
			return true
		}
	}
	
	const result = itemdb.clif_instantiate_item(id, qty, options)
	if (!result) return

	// Add to inventory
	for (let key in result) itemlist[key] = result[key]
}

const clif_del_item = (nameid='oridecon', qty=1) => {
	Object.values(itemlist).filter(item => nameid === item.nameid).forEach(item => {
		if (item.stackable) item.qty -= qty
		if ((item.qty <= 0 || !item.stackable) && !item.currency) delete itemlist[item.uid]
		if (item.currency) item.qty = item.qty <= 0 ? 0 : item.qty
	})
}

const clif_del_zeny = (qty=1) => {
	clif_del_item('zeny', qty)
}

// Default items
clif_add_item(itemdb.ids.ZENY, 25344562)
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 7, attribute: 1})
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 4, attribute: 0})
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 15, attribute: 0})
clif_add_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 3, attribute: 0})
clif_add_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 4, attribute: 0})
clif_add_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 9, attribute: 0})
clif_add_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 15, attribute: 0})
//clif_add_item(itemdb.ids.ELUNIUM, 100)
clif_add_item(itemdb.ids.ORIDECON, 100)

export default {
	itemlist, // separate from state descriptor -- unity them? TODO:
	sd,
	addItem: clif_add_item,
	findItem: clif_find_item,
	delItem: clif_del_item,
	itemInfo: clif_get_item_info,
	zeny: clif_find_currency,
	delZeny: clif_del_zeny
}