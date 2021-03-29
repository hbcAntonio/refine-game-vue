import { reactive } from 'vue'

const MAX_REFINE = 15
const MIN_REFINE = 0
const REFINE_TIME = 625
const SUCCESS_RATE = .5
const BREAK_RATE = .99

const DIALOG_MAP = {
	EMPTY_SLOT: 'Should I refine your body then?!',
	SUCCESS_REFINE: 'Splendid job I did! So happy for you!',
	FAILURE_REFINE: 'Oh no... I swear I will try to do better next time!',
	BREAK_REFINE: 'I... don\'t even know what to say!!!',
	IDLE: 'My name is Holgrehenn, and I hate you!',
	REFINING: 'Here we go...',
	BUSY: 'I happen to be busy already....',
	BROKEN: 'I cannot refine broken items...'
}

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
	if (sd.refining) return DIALOG_MAP.BUSY
	if (!sd.equip) return DIALOG_MAP.EMPTY_SLOT
	if (sd.equip.attribute) return DIALOG_MAP.BROKEN
	return 
}


const sd = reactive({
	refining: false,
	dialog: 'Hello, which equipment would you like to refine today?',
	equip: {}
})

const setEquip = (equip) => {
	sd.equip = equip
}


const start = async () => {
	sd.dialog = clif_refine_stop_check()
	if (sd.dialog) return

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
	start
}


export default refineState