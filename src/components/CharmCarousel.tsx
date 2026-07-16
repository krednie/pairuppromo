import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { BadgeId } from "../../shared/badges"
import { badges } from "../config/badges"

type CharmCarouselProps = {
  variant: "picker" | "hero"
  selectedId?: BadgeId | null
  disabled?: boolean
  onSelect?: (id: BadgeId) => void
}

export function CharmCarousel({ variant, selectedId, disabled = false, onSelect }: CharmCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null)

  if (variant === "hero") {
    return (
      <div className="hero-charm-carousel" aria-label="Founding charm collection">
        <div className="hero-charm-track">
          {[...badges, ...badges].map((badge, index) => (
            <span key={`${badge.id}-${index}`} aria-hidden={index >= badges.length}>
              <img src={badge.image} alt={index < badges.length ? badge.name : ""} />
            </span>
          ))}
        </div>
      </div>
    )
  }

  const move = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 216, behavior: "smooth" })
  }

  return (
    <div className="profile-charm-carousel" aria-label="Choose your Founding Builder charm">
      <button type="button" className="profile-charm-arrow" onClick={() => move(-1)} aria-label="Previous charms">
        <ChevronLeft />
      </button>
      <div ref={railRef} className="profile-charm-viewport">
        {badges.map((badge) => (
          <button
            key={badge.id}
            type="button"
            className={selectedId === badge.id ? "is-selected" : ""}
            aria-pressed={selectedId === badge.id}
            aria-label={badge.name}
            title={badge.name}
            disabled={disabled}
            onClick={() => onSelect?.(badge.id)}
          >
            <img src={badge.image} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <button type="button" className="profile-charm-arrow" onClick={() => move(1)} aria-label="Next charms">
        <ChevronRight />
      </button>
    </div>
  )
}
