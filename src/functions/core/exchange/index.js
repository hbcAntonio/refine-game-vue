import { reactive } from 'vue'
import * as itemdb from '../itemdb'
import inventory from '../inventory'

const sd = reactive({
	show: false,
	itemlist: {},
	selectedItem: {}
})

const clif_add_exchange_item = (id='ancient-cape', qty=1, options={}) => {
	const result = itemdb.clif_instantiate_item(id, qty, options)
	if (!result) return

	// Add to inventory
	for (let key in result) sd.itemlist[key] = result[key]
}

const clif_filter_exchange = (term) => {
	
	if (!term) return sd.itemlist

	const values = Object.values(sd.itemlist).filter(item =>
		item.resourceviewid.includes(term) || item.name.includes(term)
	)

	const result = {}

	values.forEach(value => result[value.uid] = value)
	return result
}

const clif_get_exchange_price = (item, raw=false) => {
	if (!item) return NaN

	const basePrice = item.basePrice
	if (item.currency) return NaN

	let formatter = new Intl.NumberFormat('en-US', {})
	if (raw) {
		formatter = { format: (number) => number }
	}

	if (!item.equipment) return formatter.format(basePrice)
	
	const refineCount = item.refineCount
	const oriPrice = 25000

	const guesworktable = [
		basePrice,
		basePrice + oriPrice + 10000,
		basePrice + oriPrice * 2 + 20000 + 10000,
		basePrice + oriPrice * 3 + 30000 + 20000 + 10000,
		basePrice + oriPrice * 4 + 40000 + 30000 + 20000 + 10000,
		basePrice + oriPrice * 5 + 50000 + 40000 + 30000 + 20000 + 10000,
		basePrice * (2) + oriPrice * 6 + 60000 + 50000 + 100000,
		basePrice * (2+3) + oriPrice * 7 + 70000 + 60000 + 50000 + 100000,
		basePrice * (2+3+4) + oriPrice * 8 + 80000 + 70000 + 60000 + 50000 + 100000,
		basePrice * (2+3+4+5) + oriPrice * 10 + 90000 + 80000 + 70000 + 60000 + 50000 + 100000,
		basePrice * (2+3+4+5+6+7) + (25000 * 10) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 1.5 * (2+3+4+5+6+7) + (125000) + (25000 * 11) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 2.5 * (2+3+4+5+6+7+8) + (125000 * 2) + (25000 * 12) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 3.5 * (2+3+4+5+6+7+8*2) + (125000 * 3) + (25000 * 13) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 4.5 * (2+3+4+5+6+7+8*3) + (125000 * 4) + (25000 * 14) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 10 * (2+3+4+5+6+7+8*4) + (125000 * 5) + (25000 * 15) + 190000 + 80000 + 70000 + 11000 + 100000
	]

	const guessworktable_broken = [
		0,
		0,
		0,
		0.5 * basePrice + oriPrice * 3 + 30000 + 20000 + 10000,
		basePrice + oriPrice * 4 + 40000 + 30000 + 20000 + 10000,
		basePrice + oriPrice * 5 + 50000 + 40000 + 30000 + 20000 + 10000,
		basePrice * (2) + oriPrice * 6 + 60000 + 50000 + 100000,
		basePrice * (2+3) + oriPrice * 7 + 70000 + 60000 + 50000 + 100000,
		basePrice * (2+3+4) + oriPrice * 8 + 80000 + 70000 + 60000 + 50000 + 100000,
		basePrice * (2+3+4+5) + oriPrice * 10 + 90000 + 80000 + 70000 + 60000 + 50000 + 100000,
		basePrice * (2+3+4+5+6+7) + (25000 * 10) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 1.5 * (2+3+4+5+6+7) + (125000) + (25000 * 11) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 2.5 * (2+3+4+5+6+7+8) + (125000 * 2) + (25000 * 12) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 3.5 * (2+3+4+5+6+7+8*2) + (125000 * 3) + (25000 * 13) + 190000 + 80000 + 70000 + 11000 + 100000,
		basePrice * 4.5 * (2+3+4+5+6+7+8*3) + (125000 * 4) + (25000 * 14) + 190000 + 80000 + 70000 + 11000 + 100000,
		0
	]

	return formatter.format(item.attribute === 1 ? guessworktable_broken[refineCount] : guesworktable[refineCount])
}

const clif_buy_item = (qty=1) => {
	qty=parseInt(qty)
	const tcost = clif_get_exchange_price(sd.selectedItem, true) * qty

	if (qty < 0 || sd.selectedItem.qty < qty) return
	if (tcost > inventory.zeny()) return

	inventory.delZeny(tcost)
	inventory.addItem(sd.selectedItem.nameid, qty, {
		...sd.selectedItem,
		qty
	})

	sd.itemlist[sd.selectedItem.uid].qty -= qty
	if (sd.itemlist[sd.selectedItem.uid].qty <= 0 || !sd.selectedItem.stackable)
		delete sd.itemlist[sd.selectedItem.uid]

	return true
}

clif_add_exchange_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 3, attribute: 1, stackable: true, qty: 12})
clif_add_exchange_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 4, attribute: 0})
clif_add_exchange_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 15, attribute: 0})
clif_add_exchange_item(itemdb.ids.ANCIENT_CAPE, 1, {refineCount: 3, attribute: 0})
clif_add_exchange_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 4, attribute: 0})
clif_add_exchange_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 9, attribute: 0})
clif_add_exchange_item(itemdb.ids.CRITICAL_RING, 1, {refineCount: 15, attribute: 0})
clif_add_exchange_item(itemdb.ids.ELUNIUM, 1000000)
clif_add_exchange_item(itemdb.ids.ORIDECON, 1000000)

export default {
	sd,
	clif_filter_exchange,
	clif_get_exchange_price,
	clif_buy_item
}