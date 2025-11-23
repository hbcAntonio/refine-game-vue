export const db: Record<string | number, any>
export const ids: {
  ZENY: number | string
  ANCIENT_CAPE: number | string
  CRITICAL_RING: number | string
  ELUNIUM: number | string
  ORIDECON: number | string
  [key: string]: number | string
}
export function clif_instantiate_item(
  id: string | number,
  qty: number,
  options: any
): Record<string, any> | null
