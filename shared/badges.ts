export const badgeIds = [
  "diet-coke",
  "scrunchie",
  "lip-gloss",
  "jordan-wolf-grey",
  "porsche-911-gt3-rs",
  "koenigsegg-jesko",
  "claw-clip",
  "teddy",
  "burger",
  "eiffel-tower",
] as const

export type BadgeId = (typeof badgeIds)[number]

const badgeIdSet = new Set<string>(badgeIds)

export function isBadgeId(value: unknown): value is BadgeId {
  return typeof value === "string" && badgeIdSet.has(value)
}
