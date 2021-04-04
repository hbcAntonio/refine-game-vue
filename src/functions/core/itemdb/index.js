import { nanoid } from 'nanoid'
import { ids, db } from './itemdef'

const clif_instantiate_item = (id, qty=1, options={}) => {
	const ref = db[id]
	const result = {}

	if (!ref) return

	if (!ref.stackable && !options.stackable) {
		// eslint-disable-next-line no-unused-vars
		Array.from(Array(parseInt(qty))).forEach(i => {
			const newid = nanoid()
			result[newid] = { ...ref, qty: 1, refineCount: 0, uid: newid, nameid: id}
			if (options) result[newid] = { ...result[newid], ...options}
		})

		return result
	}

	const newid = nanoid()
	result[newid] ={ ...ref, qty, uid: newid, nameid: id}
	if (options) result[newid] = { ...result[newid], ...options}
	return result
}

export {
	ids,
	db,
	clif_instantiate_item
}