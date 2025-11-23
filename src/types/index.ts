// Core game types
export interface Equipment {
  uid: string
  nameid: number
  name: string
  refineCount: number
  attribute: number // 0 = normal, 1 = broken
  armor: boolean
  resourceviewid: string
  identify?: number
  equip?: number
}

export interface InventoryItem extends Equipment {
  amount?: number
  qty?: number
  stackable?: boolean
  equipment?: boolean
  currency?: boolean
}

export interface RefineRequirements {
  zeny: number
  mat: string
  matCount: number
}

export interface RefineState {
  refining: boolean
  dialog: string
  equip: Partial<Equipment>
  show: boolean
}

export interface RepairState {
  materials: Record<string, Equipment>
  selectedMaterials: Equipment[]
  brokenEquip: Equipment | null
  show: boolean
}

export interface InventoryState {
  itemlist: Record<string, InventoryItem>
  show: boolean
}

export interface MessageState {
  messages: Record<string, string>
}
