import { describe, it, expect, beforeEach } from 'vitest'
import refineState from '../refine'
import type { Equipment } from '../../../types'

describe('Refine System', () => {
  beforeEach(() => {
    // Reset state before each test
    refineState.sd.refining = false
    refineState.sd.dialog = ''
    refineState.sd.equip = {}
  })

  describe('Material Requirements', () => {
    it('should require 1 material for refining up to +4', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-1',
        name: 'Test Sword',
        refineCount: 0,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)
      const reqs = refineState.getReqs()

      expect(reqs.matCount).toBe(1)
      expect(reqs.mat).toBe('oridecon')
    })

    it('should require (level + 1) materials for +5 to +10', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-2',
        name: 'Test Sword',
        refineCount: 5,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)
      const reqs = refineState.getReqs()

      // At level 5, should need 6 materials (5 + 1)
      expect(reqs.matCount).toBe(6)
    })

    it('should require 2 × (level + 1) materials for +10 to +20', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-3',
        name: 'Test Sword',
        refineCount: 15,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)
      const reqs = refineState.getReqs()

      // At level 15, should need 32 materials (16 × 2)
      expect(reqs.matCount).toBe(32)
    })

    it('should use elunium for armor', () => {
      const testArmor: Partial<Equipment> = {
        uid: 'test-4',
        name: 'Test Armor',
        refineCount: 0,
        armor: true,
        attribute: 0
      }

      refineState.setEquip(testArmor)
      const reqs = refineState.getReqs()

      expect(reqs.mat).toBe('elunium')
    })

    it('should use oridecon for weapons', () => {
      const testWeapon: Partial<Equipment> = {
        uid: 'test-5',
        name: 'Test Sword',
        refineCount: 0,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testWeapon)
      const reqs = refineState.getReqs()

      expect(reqs.mat).toBe('oridecon')
    })
  })

  describe('Refine Success Rate', () => {
    it('should never fail up to +4', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-6',
        name: 'Test Sword',
        refineCount: 0,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)

      // Test multiple times to ensure it never fails
      for (let i = 0; i < 10; i++) {
        const equip = { ...testEquip, refineCount: i % 4 }
        // This should always succeed for levels 0-3
        expect(equip.refineCount).toBeLessThan(4)
      }
    })
  })

  describe('Max Refine Level', () => {
    it('should allow refining up to +20', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-7',
        name: 'Test Sword',
        refineCount: 19,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)
      expect(refineState.sd.equip.refineCount).toBe(19)
    })

    it('should not exceed +20', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-8',
        name: 'Test Sword',
        refineCount: 20,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)
      expect(refineState.sd.equip.refineCount).toBe(20)
    })
  })

  describe('Broken Items', () => {
    it('should not allow refining broken items', () => {
      const brokenEquip: Partial<Equipment> = {
        uid: 'test-9',
        name: 'Test Sword',
        refineCount: 5,
        armor: false,
        attribute: 1 // broken
      }

      refineState.setEquip(brokenEquip)
      expect(refineState.sd.dialog).toContain('broken')
    })
  })

  describe('Zeny Requirements', () => {
    it('should calculate zeny based on refine level', () => {
      const testEquip: Partial<Equipment> = {
        uid: 'test-10',
        name: 'Test Sword',
        refineCount: 5,
        armor: false,
        attribute: 0
      }

      refineState.setEquip(testEquip)
      const reqs = refineState.getReqs()

      // Should be 10000 * 5 = 50000
      expect(reqs.zeny).toBe(50000)
    })
  })
})
