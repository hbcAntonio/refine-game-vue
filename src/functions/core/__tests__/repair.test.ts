import { describe, it, expect, beforeEach } from 'vitest'
import repairState from '../repair'
import type { Equipment } from '../../../types'

describe('Repair System', () => {
  beforeEach(() => {
    // Reset state before each test
    repairState.sd.materials = {}
    repairState.sd.selectedMaterials = []
    repairState.sd.brokenEquip = null
    repairState.sd.show = false
  })

  describe('Point Calculation', () => {
    it('should calculate refineCount points for items', () => {
      const item: Equipment = {
        uid: 'test-1',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 5,
        attribute: 0,
        armor: false,
        resourceviewid: 'test'
      }

      const points = repairState.getItemPoints(item)
      expect(points).toBe(5)
    })

    it('should calculate minimum 1 point for +0 items', () => {
      const zeroRefineItem: Equipment = {
        uid: 'test-2',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 0,
        attribute: 0,
        armor: false,
        resourceviewid: 'test'
      }

      const points = repairState.getItemPoints(zeroRefineItem)
      expect(points).toBe(1)
    })
  })

  describe('Required Points', () => {
    it('should require 1 point for items broken at +6 or below', () => {
      const lowLevelBroken: Equipment = {
        uid: 'test-3',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 5,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      const required = repairState.getRequiredPoints(lowLevelBroken)
      expect(required).toBe(1)
    })

    it('should require refineCount points for items broken above +6', () => {
      const highLevelBroken: Equipment = {
        uid: 'test-4',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 10,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      const required = repairState.getRequiredPoints(highLevelBroken)
      expect(required).toBe(10)
    })

    it('should require exactly refineCount points at boundary (+7)', () => {
      const boundaryBroken: Equipment = {
        uid: 'test-5',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 7,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      const required = repairState.getRequiredPoints(boundaryBroken)
      expect(required).toBe(7)
    })
  })

  describe('Selected Materials Points', () => {
    it('should calculate total points from multiple materials', () => {
      const material1: Equipment = {
        uid: 'mat-1',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 5,
        attribute: 0,
        armor: false,
        resourceviewid: 'test'
      }

      const material2: Equipment = {
        uid: 'mat-2',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 3,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      repairState.sd.selectedMaterials = [material1, material2]
      const totalPoints = repairState.getSelectedPoints()

      // 5 + 3 = 8 points total
      expect(totalPoints).toBe(8)
    })

    it('should return 0 points when no materials selected', () => {
      repairState.sd.selectedMaterials = []
      const totalPoints = repairState.getSelectedPoints()
      expect(totalPoints).toBe(0)
    })
  })

  describe('Repair Scenarios', () => {
    it('should allow repairing +5 broken with 1 non-broken item', () => {
      const brokenItem: Equipment = {
        uid: 'broken-1',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 5,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      const material: Equipment = {
        uid: 'mat-1',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 0,
        attribute: 0,
        armor: false,
        resourceviewid: 'test'
      }

      const required = repairState.getRequiredPoints(brokenItem)
      const provided = repairState.getItemPoints(material)

      expect(provided).toBeGreaterThanOrEqual(required)
    })

    it('should require 10 points to repair +10 broken item', () => {
      const brokenItem: Equipment = {
        uid: 'broken-2',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 10,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      const required = repairState.getRequiredPoints(brokenItem)
      expect(required).toBe(10)

      // Could be repaired with 10 non-broken items
      const materials: Equipment[] = Array(10)
        .fill(null)
        .map((_, i) => ({
          uid: `mat-${i}`,
          nameid: 1234,
          name: 'Test Sword',
          refineCount: 0,
          attribute: 0,
          armor: false,
          resourceviewid: 'test'
        }))

      repairState.sd.selectedMaterials = materials
      const totalPoints = repairState.getSelectedPoints()
      expect(totalPoints).toBe(10)
    })

    it('should allow repairing with combination of broken and non-broken items', () => {
      // Repairing a +12 broken item
      const brokenItem: Equipment = {
        uid: 'broken-3',
        nameid: 1234,
        name: 'Test Sword',
        refineCount: 12,
        attribute: 1,
        armor: false,
        resourceviewid: 'test'
      }

      // Using 2 broken +3 items (6 points) and 6 non-broken (6 points) = 12 points
      const broken3x2: Equipment[] = [
        {
          uid: 'b3-1',
          nameid: 1234,
          name: 'Test Sword',
          refineCount: 3,
          attribute: 1,
          armor: false,
          resourceviewid: 'test'
        },
        {
          uid: 'b3-2',
          nameid: 1234,
          name: 'Test Sword',
          refineCount: 3,
          attribute: 1,
          armor: false,
          resourceviewid: 'test'
        }
      ]

      const nonBrokenx6: Equipment[] = Array(6)
        .fill(null)
        .map((_, i) => ({
          uid: `nb-${i}`,
          nameid: 1234,
          name: 'Test Sword',
          refineCount: 0,
          attribute: 0,
          armor: false,
          resourceviewid: 'test'
        }))

      repairState.sd.selectedMaterials = [...broken3x2, ...nonBrokenx6]
      const totalPoints = repairState.getSelectedPoints()
      const required = repairState.getRequiredPoints(brokenItem)

      expect(totalPoints).toBe(12)
      expect(totalPoints).toBeGreaterThanOrEqual(required)
    })
  })
})
