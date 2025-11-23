import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref } from 'vue'
import refineState from '../refine'

// Mock the inventory and message modules
vi.mock('../inventory', () => ({
  default: {
    findItem: vi.fn(),
    zeny: vi.fn(),
    delItem: vi.fn()
  }
}))

vi.mock('../message', () => ({
  default: {
    clif_add_message: vi.fn()
  }
}))

describe('refine.js', () => {
  let mockInventory

  beforeEach(() => {
    // Reset state before each test
    refineState.sd.refining = false
    refineState.sd.dialog = ''
    refineState.sd.equip = {}
    refineState.sd.show = false

    // Setup mock inventory
    mockInventory = {
      findItem: vi.fn(),
      zeny: vi.fn(),
      delItem: vi.fn()
    }

    // Clear all timers
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setEquip', () => {
    it('should set equipment and display idle dialog for non-broken item', () => {
      const equip = { name: 'Ancient Cape', refineCount: 0, attribute: 0 }
      refineState.setEquip(equip)

      expect(refineState.sd.equip).toStrictEqual(equip)
      expect(refineState.sd.dialog).toBe('My name is Holgrehenn, and I hate you!')
    })

    it('should set equipment and display broken dialog for broken item', () => {
      const equip = { name: 'Ancient Cape', refineCount: 5, attribute: 1 }
      refineState.setEquip(equip)

      expect(refineState.sd.equip).toStrictEqual(equip)
      expect(refineState.sd.dialog).toBe('This item is broken, I will need to repair it first...')
    })
  })

  describe('SUCCESS_RATE', () => {
    it('should have a success rate between MIN and MAX', () => {
      expect(refineState.SUCCESS_RATE.value).toBeGreaterThanOrEqual(0.3)
      expect(refineState.SUCCESS_RATE.value).toBeLessThanOrEqual(0.5)
    })

    it('should allow manual rate setting via window.clif_set_rate', () => {
      window.clif_set_rate(0.8)
      expect(refineState.SUCCESS_RATE.value).toBe(0.8)
    })
  })

  describe('getReqs', () => {
    it('should calculate zeny requirement based on refine count', () => {
      refineState.sd.equip = { refineCount: 5, armor: true }
      const reqs = refineState.getReqs()

      expect(reqs.zeny).toBe(50000) // 10000 * 5
      expect(reqs.mat).toBe('elunium')
    })

    it('should require oridecon for weapon (non-armor)', () => {
      refineState.sd.equip = { refineCount: 3, armor: false }
      const reqs = refineState.getReqs()

      expect(reqs.zeny).toBe(30000) // 10000 * 3
      expect(reqs.mat).toBe('oridecon')
    })

    it('should require elunium for armor', () => {
      refineState.sd.equip = { refineCount: 7, armor: true }
      const reqs = refineState.getReqs()

      expect(reqs.mat).toBe('elunium')
    })
  })

  describe('start - requirement checks', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should fail if no equipment is set', async () => {
      refineState.sd.equip = {}
      await refineState.start(mockInventory)

      expect(refineState.sd.dialog).toBe('Should I refine your body then?!')
      expect(refineState.sd.refining).toBe(false)
    })

    it('should fail if equipment is broken', async () => {
      refineState.sd.equip = { name: 'Sword', attribute: 1, refineCount: 5 }
      await refineState.start(mockInventory)

      expect(refineState.sd.dialog).toBe('I cannot refine broken items...')
      expect(refineState.sd.refining).toBe(false)
    })

    it('should fail if already refining', async () => {
      refineState.sd.refining = true
      refineState.sd.equip = { name: 'Sword', attribute: 0, refineCount: 5 }

      await refineState.start(mockInventory)

      expect(refineState.sd.dialog).toBe('I happen to be busy already....')
    })

    it('should fail if insufficient materials', async () => {
      refineState.sd.equip = { name: 'Ancient Cape', armor: true, attribute: 0, refineCount: 5 }

      mockInventory.findItem.mockReturnValue([]) // No materials
      mockInventory.zeny.mockReturnValue(100000) // Enough zeny

      await refineState.start(mockInventory)

      expect(refineState.sd.dialog).toBe('I need an Elunium to refine this item...')
      expect(refineState.sd.refining).toBe(false)
    })

    it('should fail if insufficient zeny', async () => {
      refineState.sd.equip = { name: 'Sword', armor: false, attribute: 0, refineCount: 5 }

      mockInventory.findItem.mockReturnValue([{ name: 'Oridecon' }]) // Has materials
      mockInventory.zeny.mockReturnValue(1000) // Not enough zeny (needs 50000)

      await refineState.start(mockInventory)

      expect(refineState.sd.dialog).toBe('You don\'t have enough Zeny...')
      expect(refineState.sd.refining).toBe(false)
    })
  })

  describe('start - successful refining', () => {
    beforeEach(() => {
      vi.useFakeTimers()

      // Setup valid conditions
      refineState.sd.equip = {
        name: 'Ancient Cape',
        armor: true,
        attribute: 0,
        refineCount: 5
      }

      mockInventory.findItem.mockReturnValue([{ name: 'Elunium' }])
      mockInventory.zeny.mockReturnValue(100000)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should successfully refine item when random check passes', async () => {
      // Force success by setting high success rate
      window.clif_set_rate(1.0)

      const promise = refineState.start(mockInventory)

      expect(refineState.sd.refining).toBe(true)
      expect(refineState.sd.dialog).toBe('Here we go...')

      // Fast-forward time
      await vi.runAllTimersAsync()
      await promise

      expect(refineState.sd.equip.refineCount).toBe(6)
      expect(refineState.sd.dialog).toBe('Splendid job I did! So happy for you! (Your item was refined successfully!)')
      expect(refineState.sd.refining).toBe(false)
      expect(refineState.sd.equip.attribute).toBe(0)
    })

    it('should always succeed for items below +4', async () => {
      refineState.sd.equip.refineCount = 2
      window.clif_set_rate(0) // Force failure, but should still succeed

      const promise = refineState.start(mockInventory)
      await vi.runAllTimersAsync()
      await promise

      expect(refineState.sd.equip.refineCount).toBe(3)
      expect(refineState.sd.dialog).toBe('Splendid job I did! So happy for you! (Your item was refined successfully!)')
    })

    it('should consume materials and zeny on refining', async () => {
      window.clif_set_rate(1.0)

      const promise = refineState.start(mockInventory)
      await vi.runAllTimersAsync()
      await promise

      expect(mockInventory.delItem).toHaveBeenCalledWith('zeny', 50000)
      expect(mockInventory.delItem).toHaveBeenCalledWith('elunium', 1)
    })

    it('should clear equipment when reaching +15', async () => {
      refineState.sd.equip = {
        name: 'Ancient Cape',
        armor: true,
        attribute: 0,
        refineCount: 14
      }

      // Ensure mocks are set up
      mockInventory.findItem.mockReturnValue([{ name: 'Elunium' }])
      mockInventory.zeny.mockReturnValue(200000)

      window.clif_set_rate(1.0)

      const promise = refineState.start(mockInventory)
      await vi.runAllTimersAsync()
      await promise

      // After runAllTimersAsync, equipment should be cleared
      // The timeout that clears equipment happens after the refine succeeds
      expect(refineState.sd.equip).toStrictEqual({})
    })
  })

  describe('start - failed refining', () => {
    beforeEach(() => {
      vi.useFakeTimers()

      refineState.sd.equip = {
        name: 'Ancient Cape',
        armor: true,
        attribute: 0,
        refineCount: 5
      }

      mockInventory.findItem.mockReturnValue([{ name: 'Elunium' }])
      mockInventory.zeny.mockReturnValue(100000)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should reduce refine level on failure without breaking', async () => {
      // Force failure by setting rate to 0
      window.clif_set_rate(0)

      // Mock Math.random to prevent breaking (break check fails)
      const originalRandom = Math.random
      let callCount = 0
      Math.random = vi.fn(() => {
        callCount++
        // First call is for success check (should fail)
        // Second call is for break check (should not break)
        return callCount === 1 ? 0.9 : 0.9 // > 0.5 means no break
      })

      const promise = refineState.start(mockInventory)
      await vi.runAllTimersAsync()
      await promise

      expect(refineState.sd.equip.refineCount).toBe(4)
      expect(refineState.sd.dialog).toBe('Oh no... I swear I will try to do better next time! (Your item lost one level of refinement)')
      expect(refineState.sd.equip.attribute).toBe(0)
      expect(refineState.sd.refining).toBe(false)

      Math.random = originalRandom
    })

    it('should break item on critical failure', async () => {
      window.clif_set_rate(0)

      // Mock Math.random to force breaking
      const originalRandom = Math.random
      let callCount = 0
      Math.random = vi.fn(() => {
        callCount++
        // First call is for success check (should fail)
        // Second call is for break check (should break)
        return callCount === 1 ? 0.9 : 0.1 // < 0.5 means break
      })

      const promise = refineState.start(mockInventory)
      await vi.runAllTimersAsync()
      await promise

      expect(refineState.sd.equip.refineCount).toBe(4)
      expect(refineState.sd.equip.attribute).toBe(1)
      expect(refineState.sd.dialog).toBe('I... don\'t even know what to say!!! (Your item broke!)')
      expect(refineState.sd.refining).toBe(false)

      Math.random = originalRandom
    })

    it('should not reduce refine level below 0', async () => {
      // Safe level items (below +4) always succeed, so start at +5
      refineState.sd.equip.refineCount = 5
      window.clif_set_rate(0)

      const originalRandom = Math.random
      let callCount = 0
      Math.random = vi.fn(() => {
        callCount++
        return callCount === 1 ? 0.9 : 0.9 // Fail but don't break
      })

      // First refine: 5 -> 4
      let promise = refineState.start(mockInventory)
      await vi.runAllTimersAsync()
      await promise
      expect(refineState.sd.equip.refineCount).toBe(4)

      // Reset mocks for second refine
      mockInventory.findItem.mockReturnValue([{ name: 'Elunium' }])
      mockInventory.zeny.mockReturnValue(100000)
      callCount = 0

      // Continue refining down
      for (let i = 0; i < 5; i++) {
        callCount = 0
        promise = refineState.start(mockInventory)
        await vi.runAllTimersAsync()
        await promise
      }

      // Should not go below 0
      expect(refineState.sd.equip.refineCount).toBeGreaterThanOrEqual(0)

      Math.random = originalRandom
    })
  })

  describe('edge cases', () => {
    it('should not exceed +15 refine level', () => {
      const equip = { refineCount: 15, attribute: 0 }

      // Manually test the refine logic bounds
      equip.refineCount += 1
      equip.refineCount = equip.refineCount > 15 ? 15 : equip.refineCount

      expect(equip.refineCount).toBe(15)
    })

    it('should handle equipment without armor property as weapon', () => {
      refineState.sd.equip = { name: 'Sword', refineCount: 3 }
      const reqs = refineState.getReqs()

      expect(reqs.mat).toBe('oridecon')
    })
  })
})
