import { reactive } from 'vue'
import exchange from './exchange'
import * as itemdb from './itemdb'
import message from './message'

let saved = {}

if (localStorage.getItem('inventory')) {
	saved = JSON.parse(localStorage.getItem('inventory'))
}

const itemlist = reactive(saved.itemlist || {})
const sd = reactive(saved.sd || {
	show: false,
	canShow: true,
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
			if (itemlist[items[0].uid].equipment) itemlist[items[0].uid].qty = 1
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
		// message.clif_add_message(`Cost ${item.name} x${qty}`,1000)
	})
}

const clif_del_uid_item = (uid, qty=1) => {
	itemlist[uid].qty -= qty
	if (itemlist[uid].qty <= 0) delete itemlist[uid]
}

const clif_del_zeny = (qty=1) => {
	message.clif_add_message(`Cost ${qty} Zeny!`,1000)
	clif_del_item('zeny', qty)
}


const clif_sell_item = () => {
	clif_del_uid_item(sd.selectedItem.uid)
	clif_add_item(itemdb.ids.ZENY, exchange.clif_get_exchange_price(sd.selectedItem, true))
	message.clif_add_message(`Get ${exchange.clif_get_exchange_price(sd.selectedItem, false)} Zeny!`,1000)
	message.clif_add_message(`Sold <span style="color: orange;">${sd.selectedItem.refineCount ? `+${sd.selectedItem.refineCount}` : ''} ${sd.selectedItem.name}<span>`,1000)
	sd.selectedItem = {}
	
}

// Default items
if (Object.values(itemlist).length <= 0) {
	clif_add_item(itemdb.ids.ZENY, 25344562)
	clif_add_item(itemdb.ids.ANCIENT_CAPE, 5, {refineCount: 4, attribute: 0})
	clif_add_item(itemdb.ids.CRITICAL_RING, 5, {refineCount: 4, attribute: 0})
	clif_add_item(itemdb.ids.ELUNIUM, 100)
	clif_add_item(itemdb.ids.ORIDECON, 100)
}


// Saving
setInterval(() => {
	localStorage.setItem('inventory', JSON.stringify({ itemlist, sd }))
}, 5000)

export default {
	itemlist, // separate from state descriptor -- unity them? TODO:
	sd,
	addItem: clif_add_item,
	findItem: clif_find_item,
	delItem: clif_del_item,
	itemInfo: clif_get_item_info,
	zeny: clif_find_currency,
	delZeny: clif_del_zeny,
	sellItem: clif_sell_item
}