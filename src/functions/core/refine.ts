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

const SUCCESS_PHRASES = [
  'Magnificent! I knew I could do it!',
  'Ha! Another masterpiece from yours truly!',
  'Perfection! You may thank me later.',
  'Success! Though I had my doubts about YOU...',
  'Brilliant work, as expected from ME!',
  'Wonderful! This is why I\'m the best!'
]

const FAILURE_PHRASES = [
  'Oops... well, these things happen to the BEST of us!',
  'Not my fault! The materials were clearly sub-par.',
  'Ugh! I swear the hammer slipped...',
  'Almost had it! Next time for sure!',
  'This never happened when I worked for the king...',
  'Hmm... perhaps I should have had breakfast first.'
]

const BREAK_PHRASES = [
  'WHAT?! No, no, NO! This is unprecedented!',
  'I... I don\'t believe it! The cosmos are against us!',
  'Catastrophe! But surely not MY fault!',
  'Oh dear... perhaps we should never speak of this again.',
  'IMPOSSIBLE! My technique is flawless!',
  'Well... at least it can be repaired, yes?'
]

const IDLE_PHRASES = [
  'My name is Holgrehenn, the finest smith in all the lands!',
  'What masterpiece shall we create today?',
  'Ah, another customer seeking perfection!',
  'Choose wisely, I don\'t work for free you know!',
  'My hammer awaits! Which equipment shall we enhance?',
  'Step right up! Holgrehenn\'s shop never disappoints!'
]

const DIALOG_MAP = {
  EMPTY_SLOT: 'Should I refine your body then?! Select an item first!',
  SUCCESS_REFINE: '',  // Will be filled dynamically
  FAILURE_REFINE: '',  // Will be filled dynamically
  BREAK_REFINE: '',    // Will be filled dynamically
  IDLE: '',            // Will be filled dynamically
  IDLE_BROKEN: 'This item is broken! I\'ll need to repair it before any refining can occur.',
  REFINING: 'Let the magic begin...',
  BUSY: 'Patience! I\'m already working on something!',
  BROKEN: 'I cannot refine broken items! Get it repaired first!',
  MISSING_ZENY: 'You don\'t have enough Zeny! My services aren\'t free!',
  MISSING_MATERIAL: {
    oridecon: 'I need Oridecon to refine this weapon! More of it, actually...',
    elunium: 'I need Elunium to refine this armor! Bring me more!'
  }
} as const

// Helper to get random phrase
const getRandomPhrase = (phrases: readonly string[]): string => {
  return phrases[Math.floor(Math.random() * phrases.length)]
}

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
    // +4 to +9: (level + 1) materials
    // e.g., at +5 need 6 mats to go to +6
    matCount = currentLevel + 1
  } else {
    // +10 to +19: level × 2 materials
    // e.g., at +10 need 20 mats to go to +11
    matCount = currentLevel * 2
  }

  return { zeny, mat, matCount }
}

const clif_refine_check_requirements = (inventory: typeof inventoryState): boolean => {
  const { zeny, mat, matCount } = clif_refine_get_reqs()

  // Calculate total quantity of materials
  const foundItems = inventory.findItem(mat)
  const totalMaterialQty = foundItems.reduce((sum, item) => sum + (item.qty || 1), 0)

  if (totalMaterialQty < matCount) {
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
  sd.dialog = equip.attribute ? DIALOG_MAP.IDLE_BROKEN : getRandomPhrase(IDLE_PHRASES)
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
        sd.dialog = getRandomPhrase(SUCCESS_PHRASES)
        message.clif_add_message('<strong style="color: limegreen;">Success!</strong>', 1000)
        if (sd.equip.refineCount === MAX_REFINE) {
          sd.equip = {}
          setTimeout(
            () =>
              message.clif_add_message('<strong style="color: limegreen;">+' + MAX_REFINE + ' LEGENDARY!</strong>', 1000),
            1000
          )
        }
        resolve()
        return
      }

      sd.dialog = sd.equip.attribute ? getRandomPhrase(BREAK_PHRASES) : getRandomPhrase(FAILURE_PHRASES)
      message.clif_add_message(
        `<strong style="color: ${sd.equip.attribute ? 'red' : 'orange'};">${sd.equip.attribute ? 'Broken!' : 'Failed!'}</strong>`,
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
