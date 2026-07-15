import { useEffect, useRef, useState } from "react"
import { Code2, Lightbulb, Mic2, Palette } from "lucide-react"
import { BrandMark } from "./BrandMark"

type CollisionPhase = "idle" | "searching" | "matched" | "building"

const profiles = [
  {
    className: "collision-card-developer",
    role: "Developer",
    detail: "React · AI/ML",
    goal: "AI tools · Hackathons",
    status: "Ready to build",
    icon: Code2,
  },
  {
    className: "collision-card-designer",
    role: "Designer",
    detail: "UI/UX · Research",
    goal: "Consumer apps",
    status: "Looking for a team",
    icon: Palette,
  },
  {
    className: "collision-card-product",
    role: "Product thinker",
    detail: "Product · Data",
    goal: "Hackathon goals",
    status: "Ready to build",
    icon: Lightbulb,
  },
  {
    className: "collision-card-presenter",
    role: "Presenter",
    detail: "Pitching · Content",
    goal: "Story · Hackathons",
    status: "Looking for a team",
    icon: Mic2,
  },
]

const phases: Exclude<CollisionPhase, "idle">[] = ["searching", "matched", "building"]

export function CollisionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<CollisionPhase>("idle")

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("building")
      return
    }

    const timers: number[] = []
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setPhase("searching")
        timers.push(window.setTimeout(() => setPhase("matched"), 1100))
        timers.push(window.setTimeout(() => setPhase("building"), 2200))
        observer.disconnect()
      },
      { threshold: 0.28 },
    )

    observer.observe(section)
    return () => {
      observer.disconnect()
      timers.forEach(window.clearTimeout)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="collision"
      className={"collision-section is-" + phase}
      aria-labelledby="collision-title"
    >
      <div className="collision-copy">
        <h2 id="collision-title">Your next great team may already be here.</h2>
        <div className="collision-status" aria-live="polite" aria-label={"Team status: " + phase}>
          {phases.map((item) => (
            <span className={phase === item ? "is-current" : ""} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="collision-stage" aria-label="Four prototype profiles forming a complementary team">
        <svg className="collision-network" viewBox="0 0 900 620" aria-hidden="true">
          <ellipse cx="450" cy="310" rx="314" ry="226" />
          <path pathLength="1" d="M246 160C316 210 379 260 450 310" />
          <path pathLength="1" d="M654 165C588 214 526 262 450 310" />
          <path pathLength="1" d="M238 458C314 414 382 365 450 310" />
          <path pathLength="1" d="M663 455C587 414 521 363 450 310" />
          <path className="collision-pulse" pathLength="1" d="M246 160C349 244 550 376 663 455" />
        </svg>

        <div className="collision-core">
          <BrandMark className="collision-mark" />
          <strong>PairUp</strong>
        </div>

        {profiles.map(({ className, role, detail, goal, status, icon: Icon }) => (
          <article className={"collision-card " + className} key={role}>
            <div className="collision-card-head">
              <span className="collision-avatar"><Icon size={18} /></span>
              <span>PROTOTYPE PROFILE</span>
            </div>
            <h3>{role}</h3>
            <p>{detail}</p>
            <div className="collision-card-fields">
              <span>First name</span>
              <span>University</span>
            </div>
            <div className="collision-card-foot">
              <span>{goal}</span>
              <strong>{status}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
