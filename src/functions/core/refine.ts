import { reactive, ref, Ref } from 'vue'
import type { Equipment, RefineRequirements, RefineState } from '../../types'
import inventoryState from './inventory'
import message from './message'

// Extend Window interface for custom properties
declare global {
  interface Window {
    success_rate?: number
    clif_set_rate?: (rate: number) => void
  }
}

const MAX_REFINE = 20
const MIN_REFINE = 0
const REFINE_TIME = 625
const SUCCESS_RATE_MIN = 0.3
const SUCCESS_RATE_MAX = 0.5
const BREAK_RATE = 0.5
const ZENY_FIXED_REQ = 10000

const clif_get_random_range = (MIN = 0, MAX = 1): number => {
  const DELTA = MAX - MIN
  const init = Math.random()
  const mult = init * DELTA
  return mult + MIN
}

const SUCCESS_RATE: Ref<number> = ref(clif_get_random_range(SUCCESS_RATE_MIN, SUCCESS_RATE_MAX))

setInterval(() => {
  SUCCESS_RATE.value = window.success_rate || clif_get_random_range(SUCCESS_RATE_MIN, SUCCESS_RATE_MAX)
  console.log('changing success-rate to', SUCCESS_RATE.value)
}, clif_get_random_range(60000 * 1, 60000 * 3))

window.clif_set_rate = (rate: number) => {
  SUCCESS_RATE.value = rate
}

const DIALOG_MAP = {
  EMPTY_SLOT: 'Should I refine your body then?!',
  SUCCESS_REFINE: 'Splendid job I did! So happy for you! (Your item was refined successfully!)',
  FAILURE_REFINE: 'Oh no... I swear I will try to do better next time! (Your item lost one level of refinement)',
  BREAK_REFINE: "I... don't even know what to say!!! (Your item broke!)",
  IDLE: 'My name is Holgrehenn, and I hate you!',
  IDLE_BROKEN: 'This item is broken, I will need to repair it first...',
  REFINING: 'Here we go...',
  BUSY: 'I happen to be busy already....',
  BROKEN: 'I cannot refine broken items...',
  MISSING_ZENY: "You don't have enough Zeny...",
  MISSING_MATERIAL: {
    oridecon: 'I need an Oridecon to refine this item...',
    elunium: 'I need an Elunium to refine this item...'
  }
} as const

const sd = reactive<RefineState>({
  refining: false,
  dialog: 'Hello, which equipment would you like to refine today?',
  equip: {},
  show: false
})

const clif_refine_sub = (equip: Partial<Equipment>, success: boolean): boolean => {
  if (!equip.refineCount) equip.refineCount = 0

  // Never fail up to +4
  if (equip.refineCount < 4) success = true

  equip.refineCount += 1 * (success ? 1 : -1)
  equip.refineCount =
    equip.refineCount > MAX_REFINE ? MAX_REFINE : equip.refineCount < MIN_REFINE ? 0 : equip.refineCount

  return success
}

const clif_refine = (equip: Partial<Equipment>, rate?: number, breakRate = BREAK_RATE): boolean => {
  if (!rate) rate = SUCCESS_RATE.value
  if (equip.attribute) return false

  if (!clif_refine_sub(equip, Math.random() < rate)) {
    const shouldBreak = Math.random() < breakRate
    equip.attribute = shouldBreak ? 1 : 0
    return false
  }

  return true
}

const clif_refine_stop_check = (): boolean => {
  if (sd.refining) sd.dialog = DIALOG_MAP.BUSY
  if (!sd.equip.name) sd.dialog = DIALOG_MAP.EMPTY_SLOT
  if (sd.equip.attribute) sd.dialog = DIALOG_MAP.BROKEN

  return !!sd.dialog
}

const clif_refine_get_reqs = (): RefineRequirements => {
  const refineCount = sd.equip.refineCount || 0
  const zeny = parseInt(String(ZENY_FIXED_REQ * refineCount))
  const mat = sd.equip.armor ? 'elunium' : 'oridecon'

  // Calculate material requirements based on tier
  let matCount = 1
  const currentLevel = refineCount

  if (currentLevel < 4) {
    // Up to +4: 1x material
    matCount = 1
  } else if (currentLevel >= 4 && currentLevel < 10) {
    // +5 to +10: level × material
    matCount = currentLevel + 1
  } else {
    // +10 to +20: 2 × level material
    matCount = (currentLevel + 1) * 2
  }

  return { zeny, mat, matCount }
}

const clif_refine_check_requirements = (inventory: typeof inventoryState): boolean => {
  const { zeny, mat, matCount } = clif_refine_get_reqs()

  if (inventory.findItem(mat).length < matCount) {
    sd.dialog = DIALOG_MAP.MISSING_MATERIAL[mat as keyof typeof DIALOG_MAP.MISSING_MATERIAL]
  }
  const currentZeny = Number(inventory.zeny())
  if (currentZeny <= zeny) sd.dialog = DIALOG_MAP.MISSING_ZENY

  if (sd.dialog) return false

  inventory.delItem('zeny', zeny)
  inventory.delItem(mat, matCount)

  return true
}

const setEquip = (equip: Partial<Equipment>): void => {
  sd.equip = equip
  sd.dialog = equip.attribute ? DIALOG_MAP.IDLE_BROKEN : DIALOG_MAP.IDLE
}

const start = async (inventory = inventoryState): Promise<void> => {
  sd.dialog = ''

  if (clif_refine_stop_check()) return
  if (!clif_refine_check_requirements(inventory)) return

  sd.refining = true
  sd.dialog = DIALOG_MAP.REFINING

  await new Promise<void>(resolve =>
    setTimeout(() => {
      if (clif_refine(sd.equip)) {
        sd.dialog = DIALOG_MAP.SUCCESS_REFINE
        message.clif_add_message('<strong style="color: limegreen;">Success!</strong>', 1000)
        if (sd.equip.refineCount === MAX_REFINE) {
          sd.equip = {}
          setTimeout(
            () =>
              message.clif_add_message('<strong style="color: limegreen;">+' + MAX_REFINE + ' Achieved!</strong>', 1000),
            1000
          )
        }
        resolve()
        return
      }

      sd.dialog = sd.equip.attribute ? DIALOG_MAP.BREAK_REFINE : DIALOG_MAP.FAILURE_REFINE
      message.clif_add_message(
        `<strong style="color: ${sd.equip.attribute ? 'red' : 'orange'};">${sd.equip.attribute ? 'Broken' : 'Failure'}!</strong>`,
        1000
      )
      resolve()
    }, REFINE_TIME)
  )

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
