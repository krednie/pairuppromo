import type { BadgeId } from "../../shared/badges"

export type Badge = {
  id: BadgeId
  name: string
  shortName: string
  image: string
}

export const badges: Badge[] = [
  { id: "diet-coke", name: "Diet Coke", shortName: "Diet Coke", image: "/assets/badges/diet-coke.webp" },
  { id: "scrunchie", name: "Silk scrunchie", shortName: "Scrunchie", image: "/assets/badges/scrunchie.webp" },
  { id: "lip-gloss", name: "Lip gloss", shortName: "Gloss", image: "/assets/badges/lip-gloss.webp" },
  { id: "jordan-wolf-grey", name: "Jordan 1 Wolf Grey", shortName: "Jordan 1", image: "/assets/badges/jordan-wolf-grey.webp" },
  { id: "porsche-911-gt3-rs", name: "911 GT3 RS", shortName: "GT3 RS", image: "/assets/badges/porsche-911-gt3-rs.webp" },
  { id: "koenigsegg-jesko", name: "Koenigsegg Jesko", shortName: "Jesko", image: "/assets/badges/koenigsegg-jesko.webp" },
  { id: "claw-clip", name: "Tortoiseshell claw", shortName: "Claw", image: "/assets/badges/claw-clip.webp" },
  { id: "teddy", name: "Classic teddy", shortName: "Teddy", image: "/assets/badges/teddy.webp" },
  { id: "burger", name: "Cheeseburger", shortName: "Burger", image: "/assets/badges/burger.webp" },
  { id: "eiffel-tower", name: "Eiffel Tower", shortName: "Eiffel", image: "/assets/badges/eiffel-tower.webp" },
]

export function getBadge(id: BadgeId | null) {
  return badges.find((badge) => badge.id === id) ?? null
}
