import { reactive, ref } from 'vue'
import inventoryState from './inventory'
import message from './message'

const MAX_REFINE = 15
const MIN_REFINE = 0
const REFINE_TIME = 625
const SUCCESS_RATE_MIN = .3
const SUCCESS_RATE_MAX = .5
const BREAK_RATE = .5
const ZENY_FIXED_REQ = 10000

const clif_get_random_range = (MIN=0, MAX=1) => {
	const DELTA = MAX-MIN
	const init = Math.random()
	const mult =  init * DELTA
	return mult + MIN
}

let SUCCESS_RATE = ref(clif_get_random_range(SUCCESS_RATE_MIN, SUCCESS_RATE_MAX))
setInterval(() => {
	SUCCESS_RATE.value = window.success_rate || clif_get_random_range(SUCCESS_RATE_MIN, SUCCESS_RATE_MAX)
	console.log('changing success-rate to', SUCCESS_RATE.value)
}, clif_get_random_range(60000*1, 60000*3))

window.clif_set_rate = (rate) => SUCCESS_RATE.value = rate

const DIALOG_MAP = {
	EMPTY_SLOT: 'Should I refine your body then?!',
	SUCCESS_REFINE: 'Splendid job I did! So happy for you! (Your item was refined successfully!)',
	FAILURE_REFINE: 'Oh no... I swear I will try to do better next time! (Your item lost one level of refinement)',
	BREAK_REFINE: 'I... don\'t even know what to say!!! (Your item broke!)',
	IDLE: 'My name is Holgrehenn, and I hate you!',
	IDLE_BROKEN: 'This item is broken, I will need to repair it first...',
	REFINING: 'Here we go...',
	BUSY: 'I happen to be busy already....',
	BROKEN: 'I cannot refine broken items...',
	MISSING_ZENY: 'You don\'t have enough Zeny...',
	MISSING_MATERIAL: {
		oridecon: 'I need an Oridecon to refine this item...',
		elunium: 'I need an Elunium to refine this item...'
	}
}

const sd = reactive({
	refining: false,
	dialog: 'Hello, which equipment would you like to refine today?',
	equip: {},
	show: false
})


const clif_refine_sub = (equip, success) => {
	if (equip.refineCount < 4) success = true

	equip.refineCount += 1 * (success ? 1: -1)
	equip.refineCount = equip.refineCount > MAX_REFINE ? 15 : (equip.refineCount < MIN_REFINE ? 0 : equip.refineCount)

	return success
}

const clif_refine = (equip, rate, breakRate=BREAK_RATE) => {
	if (!rate) rate = SUCCESS_RATE.value
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
	const zeny = parseInt(ZENY_FIXED_REQ * sd.equip.refineCount)
	const mat = sd.equip.armor ? 'elunium' : 'oridecon'

	return { zeny, mat }
}

const clif_refine_check_requirements = (inventory) => {
	const { zeny, mat } = clif_refine_get_reqs()

	if (inventory.findItem(mat).length <= 0) sd.dialog = DIALOG_MAP.MISSING_MATERIAL[mat]
	if (inventory.zeny() <= zeny) sd.dialog = DIALOG_MAP.MISSING_ZENY

	if (sd.dialog) return false

	inventory.delItem('zeny', zeny)
	inventory.delItem(mat, 1)

	return true
}

const setEquip = (equip) => {
	sd.equip = equip
	sd.dialog = equip.attribute ? DIALOG_MAP.IDLE_BROKEN : DIALOG_MAP.IDLE
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
			message.clif_add_message('<strong style="color: limegreen;">Success!</strong>', 1000)
			if (sd.equip.refineCount === 15) {
				sd.equip = {}
				setTimeout(() => message.clif_add_message('<strong style="color: limegreen;">+15 Achieved!</strong>', 1000), 1000)
			}
			resolve()
			return
		}

		sd.dialog = sd.equip.attribute ? DIALOG_MAP.BREAK_REFINE : DIALOG_MAP.FAILURE_REFINE
		message.clif_add_message(`<strong style="color: ${sd.equip.attribute ? 'red' : 'orange'};">${sd.equip.attribute ? 'Broken' : 'Failure'}!</strong>`, 1000)
		resolve()
	}, REFINE_TIME))

	sd.refining = false
}

const refineState = {
	sd,
	SUCCESS_RATE,
	setEquip,
	start,
	getReqs: clif_refine_get_reqs
}


export default refineState
