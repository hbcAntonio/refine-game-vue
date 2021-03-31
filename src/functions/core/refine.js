import { reactive } from 'vue'
import inventoryState from './inventory'

const MAX_REFINE = 15
const MIN_REFINE = 0
const REFINE_TIME = 625
const SUCCESS_RATE = .35
const BREAK_RATE = .5
const ZENY_FIXED_REQ = 10000

const DIALOG_MAP = {
	EMPTY_SLOT: 'Should I refine your body then?!',
	SUCCESS_REFINE: 'Splendid job I did! So happy for you!',
	FAILURE_REFINE: 'Oh no... I swear I will try to do better next time!',
	BREAK_REFINE: 'I... don\'t even know what to say!!!',
	IDLE: 'My name is Holgrehenn, and I hate you!',
	REFINING: 'Here we go...',
	BUSY: 'I happen to be busy already....',
	BROKEN: 'I cannot refine broken items...',
	MISSING_ORIDECON: 'I need an Oridecon to refine this item...',
	MISSING_ZENY: 'You can\'t expect me to do this for free!'
}

const sd = reactive({
	refining: false,
	dialog: 'Hello, which equipment would you like to refine today?',
	equip: {}
})


const clif_refine_sub = (equip, success) => {
	if (equip.refineCount < 4) success = true

	equip.refineCount += 1 * (success ? 1: -1)
	equip.refineCount = equip.refineCount > MAX_REFINE ? 15 : (equip.refineCount < MIN_REFINE ? 0 : equip.refineCount)

	return success
}

const clif_refine = (equip, rate=SUCCESS_RATE, breakRate=BREAK_RATE) => {
	if (equip.attribute) return false

	if (!clif_refine_sub(equip, Math.random() < rate)) {
		const shouldBreak = Math.random() < breakRate
		equip.attribute = shouldBreak ? 1 : 0
		return false
	}

	return true
}

const clif_refine_stop_check = () => {
	if (sd.refining) sd.dialog=DIALOG_MAP.BUSY
	if (!sd.equip.name) sd.dialog=DIALOG_MAP.EMPTY_SLOT
	if (sd.equip.attribute) sd.dialog=DIALOG_MAP.BROKEN

	return !!sd.dialog
}

const clif_refine_get_reqs = () => {
	const zeny = ZENY_FIXED_REQ * sd.equip.refineCount
	const mat = sd.equip.armor ? 'elunium' : 'oridecon'

	return { zeny, mat }
}

const clif_refine_check_requirements = (inventory) => {
	const { zeny, mat } = clif_refine_get_reqs

	if (inventory.findItem(mat).length <= 0) sd.dialog = DIALOG_MAP.MISSING_MATERIAL
	if (inventory.zeny() <= zeny) sd.dialog = DIALOG_MAP.MISSING_ZENY

	if (sd.dialog) return false

	inventory.delItem('zeny', zeny)
	inventory.delItem(mat, 1)

	return true
}



const setEquip = (equip) => {
	sd.equip = equip
}


const start = async (inventory=inventoryState) => {
	sd.dialog = ''

	if (clif_refine_stop_check()) return
	if (!clif_refine_check_requirements(inventory)) return 

	sd.refining = true
	sd.dialog = DIALOG_MAP.REFINING

	await new Promise(resolve => setTimeout(() => {
		if (clif_refine(sd.equip)) {
			sd.dialog = DIALOG_MAP.SUCCESS_REFINE
			resolve()
			return
		}

		sd.dialog = sd.equip.attribute ? DIALOG_MAP.BREAK_REFINE : DIALOG_MAP.FAILURE_REFINE
		resolve()
	}, REFINE_TIME))

	sd.refining = false
}

const refineState = {
	sd,
	setEquip,
	start,
	getReqs: clif_refine_get_reqs
}


export default refineState