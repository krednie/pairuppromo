import { useRef, type PointerEvent } from "react"
import { ArrowDown, ArrowRight, MoveRight } from "lucide-react"
import { BrandMark } from "../BrandMark"
import { GlassButton } from "../ui/glass-button"
import { MajesticSignalScene } from "./MajesticSignalScene"

type EmptySpaceHeroProps = {
  topBarVisible: boolean
  onJoin: () => void
}

export function EmptySpaceHero({ topBarVisible, onJoin }: EmptySpaceHeroProps) {
  const magneticRef = useRef<HTMLDivElement>(null)

  const moveMagnet = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left - bounds.width / 2
    const y = event.clientY - bounds.top - bounds.height / 2
    magneticRef.current?.style.setProperty("transform", `translate3d(${x * 0.18}px, ${y * 0.22}px, 0)`)
  }

  const resetMagnet = () => magneticRef.current?.style.setProperty("transform", "translate3d(0, 0, 0)")

  return (
    <>
      <header className={`empty-space-topbar${topBarVisible ? " is-visible" : ""}`}>
        <a className="empty-space-topbar-brand" href="#top" aria-label="PairUp home">
          <BrandMark />
          <span>PairUp</span>
        </a>
        <GlassButton className="empty-space-topbar-cta" size="sm" tone="dark" type="button" onClick={onJoin} contentClassName="gap-2.5">
          Join early
          <ArrowRight size={15} />
        </GlassButton>
      </header>

      <section id="top" className="empty-space-hero" aria-labelledby="empty-space-title">
        <div className="empty-space-art">
          <MajesticSignalScene />
        </div>

        <p className="empty-space-secondary">
          Early members get a permanent Founding Builder badge, referral perks, and priority access.
        </p>

        <div className="empty-space-content">
          <a className="empty-space-brand" href="#top" aria-label="PairUp home">
            <BrandMark />
            <span>PairUp</span>
          </a>
          <h1 id="empty-space-title" className="empty-space-title">
            <span className="empty-space-title-line"><span>Build better.</span></span>
            <span className="empty-space-title-line empty-space-title-serif"><span>Together.</span></span>
          </h1>
          <p className="empty-space-opening">Great ideas deserve the right team.</p>

          <div className="empty-space-magnetic-zone" onPointerMove={moveMagnet} onPointerLeave={resetMagnet}>
            <div ref={magneticRef} className="empty-space-magnetic-button">
              <GlassButton className="empty-space-primary-cta" size="lg" tone="coral" type="button" onClick={onJoin} contentClassName="gap-3">
                Find your Dream Team
                <MoveRight size={18} />
              </GlassButton>
            </div>
          </div>

        </div>

        <a className="empty-space-scroll" href="#signals" aria-label="Continue to the next chapter">
          <ArrowDown size={17} />
        </a>
      </section>
    </>
  )
}

