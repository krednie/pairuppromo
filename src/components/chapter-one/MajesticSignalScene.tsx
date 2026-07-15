import { useEffect, useRef } from "react"

const signals = [
  ["8%", "20%", 0.34, "gold"],
  ["16%", "43%", 0.18, "bone"],
  ["29%", "16%", 0.28, "coral"],
  ["39%", "34%", 0.42, "gold"],
  ["55%", "13%", 0.2, "bone"],
  ["67%", "29%", 0.38, "cyan"],
  ["78%", "17%", 0.25, "gold"],
  ["90%", "39%", 0.32, "coral"],
  ["73%", "50%", 0.16, "bone"],
  ["24%", "53%", 0.22, "cyan"],
] as const

export function MajesticSignalScene() {
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const resetSignals = () => {
      scene.querySelectorAll<HTMLElement>(".majestic-signal").forEach((signal) => {
        signal.style.setProperty("--signal-x", "0px")
        signal.style.setProperty("--signal-y", "0px")
      })
    }

    const moveSignals = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return
      const bounds = scene.getBoundingClientRect()
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      if (!inside) {
        resetSignals()
        return
      }

      const offsetX = event.clientX - (bounds.left + bounds.width / 2)
      const offsetY = event.clientY - (bounds.top + bounds.height / 2)
      scene.querySelectorAll<HTMLElement>(".majestic-signal").forEach((signal) => {
        const strength = Number(signal.dataset.strength || 0)
        signal.style.setProperty("--signal-x", `${offsetX * strength * 0.075}px`)
        signal.style.setProperty("--signal-y", `${offsetY * strength * 0.075}px`)
      })
    }

    window.addEventListener("pointermove", moveSignals, { passive: true })
    return () => window.removeEventListener("pointermove", moveSignals)
  }, [])

  return (
    <div ref={sceneRef} className="majestic-scene" aria-hidden="true">
      <div className="majestic-sky-wash" />
      <svg className="majestic-landscape" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice">
        <defs>
          <pattern id="jali-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M21 1 41 21 21 41 1 21Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="21" cy="21" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.65" />
          </pattern>
          <pattern id="builder-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.1" fill="#f2f0df" />
          </pattern>
          <linearGradient id="bone-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d8d3bd" />
            <stop offset="0.45" stopColor="#f4f0d9" />
            <stop offset="1" stopColor="#bcb8aa" />
          </linearGradient>
          <linearGradient id="coral-sand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff7568" />
            <stop offset="1" stopColor="#b73e42" />
          </linearGradient>
          <filter id="scene-soften" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.55" />
          </filter>
        </defs>

        <path className="majestic-arid-horizon" d="M0 640C172 597 277 627 403 606c164-28 244-100 414-93 195 8 275 103 454 79 123-16 217-74 329-81v489H0Z" />
        <rect className="majestic-jali" x="0" y="388" width="1600" height="290" fill="url(#jali-grid)" />

        <g className="majestic-terrain majestic-terrain-rear" filter="url(#scene-soften)">
          <path fill="url(#bone-sweep)" d="M-80 698c178-121 344-112 486-45 122 58 188 69 321 20 134-50 224-45 351 24 164 89 320-15 602-31v334H-80Z" />
          <path d="M-55 767c164-88 290-67 404-15 119 54 241 88 377 21 143-70 276-36 386 20 122 62 267 34 521-37v244H-55Z" />
          <path className="majestic-bone-cutout" d="M50 722c131-78 243-62 315-15 47 31 19 76-45 92-90 23-136-36-224 5-64 30-121-35-46-82Zm1005 33c120-74 254-68 371-15 59 27 52 75-12 98-93 33-167-38-256-9-89 29-182-21-103-74Z" />
        </g>

        <g className="majestic-terrain majestic-terrain-mid">
          <path d="M-100 822c182-113 320-93 476-35 156 58 274 62 429-10 174-81 331-57 473 8 130 60 242 80 422 25v190H-100Z" />
          <path className="majestic-contour" d="M-38 850c179-98 326-73 459-24 161 59 269 50 407-13 171-77 303-45 447 14 133 55 241 59 379 19" />
          <path className="majestic-contour" d="M-18 891c177-80 309-53 440-10 159 52 278 41 423-19 153-63 294-28 427 22 120 44 232 44 373 3" />
        </g>

        <g className="majestic-terrain majestic-terrain-front">
          <path fill="url(#bone-sweep)" d="M-90 925c197-86 352-65 489-22 167 53 313 34 472-22 155-55 298-33 446 8 136 37 247 47 373 15v96H-90Z" />
          <path className="majestic-front-ink" d="M157 946c115-35 229-31 323 0 48 16 51 35-3 54H131c-41-21-27-38 26-54Zm818-20c119-41 245-32 340 4 47 18 42 45-13 70H895c-42-33-14-55 80-74Z" />
          <path className="majestic-coral-ridge" fill="url(#coral-sand)" d="M663 936c92-38 188-45 282-18 41 12 60 31 17 41-102 24-205 23-305 4-31-6-28-13 6-27Z" />
        </g>

        <g className="majestic-builder">
          <ellipse className="majestic-builder-shadow" cx="805" cy="889" rx="54" ry="10" />
          <path className="majestic-builder-leg" d="m789 797 17 2-5 90h-13Z" />
          <path className="majestic-builder-leg" d="m816 797 15-1 12 93h-14Z" />
          <path className="majestic-builder-body" fill="url(#builder-dots)" d="M772 685c19-23 60-22 79 2 18 23 23 81 13 125-31 12-71 11-103-2-7-49-4-105 11-125Z" />
          <path className="majestic-builder-coat" d="M771 687c15-22 60-28 80 0-3 28-10 62-7 112-14 7-24 10-35 11l-9-96-10 96c-10-2-20-5-29-10 4-47-3-82 10-113Z" />
          <circle className="majestic-builder-head" cx="806" cy="654" r="30" />
          <path className="majestic-builder-hair" d="M776 652c1-31 18-47 40-44 25 3 30 27 43 43-13 1-22-3-31-10-8 9-26 16-52 11Z" />
          <path className="majestic-builder-hair" d="M836 645c12 9 22 13 37 16-15 8-31 8-43 1Z" />
        </g>

        <path className="majestic-thread" d="M303 282C489 177 675 264 796 467c105 176 269 218 485 114" />
        <path className="majestic-thread majestic-thread-short" d="M1035 236c113-47 214-23 290 57" />
      </svg>

      <div className="majestic-signals">
        {signals.map(([left, top, strength, tone], index) => (
          <span className={`majestic-signal majestic-signal-${tone}`} data-strength={strength} key={`${left}-${top}`} style={{ left, top, animationDelay: `${index * -0.83}s` }} />
        ))}
      </div>
    </div>
  )
}

