import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Check, Code2, Cpu, Lightbulb, Mic2, Palette, Search, Video, X } from "lucide-react"
import { BrandMark } from "./BrandMark"
import { useJaliSway } from "../hooks/useJaliSway"

type CollisionPhase = "idle" | "searching" | "matched" | "building"
type Decision = "accepted" | "rejected"

const profiles = [
  {
    className: "collision-reject-one",
    portrait: "/assets/generated/profile-research.webp",
    name: "Naina",
    role: "Research",
    detail: "Research · Data",
    goal: "Sustainability",
    status: "Looking for a team",
    university: "MUJ",
    decision: "rejected" as Decision,
    icon: Search,
  },
  {
    className: "collision-slot-one",
    portrait: "/assets/generated/profile-agrima.webp",
    name: "Agrima",
    role: "Developer",
    detail: "React · AI/ML",
    goal: "AI tools · Hackathons",
    status: "Ready to build",
    university: "MUJ",
    decision: "accepted" as Decision,
    icon: Code2,
  },
  {
    className: "collision-reject-two",
    portrait: "/assets/generated/profile-video.webp",
    name: "Kabir",
    role: "Video",
    detail: "Video · Content",
    goal: "Consumer apps",
    status: "Looking for a team",
    university: "MUJ",
    decision: "rejected" as Decision,
    icon: Video,
  },
  {
    className: "collision-slot-two",
    portrait: "/assets/generated/profile-ria.webp",
    name: "Ria",
    role: "Designer",
    detail: "UI/UX · Research",
    goal: "Consumer apps",
    status: "Looking for a team",
    university: "MUJ",
    decision: "accepted" as Decision,
    icon: Palette,
  },
  {
    className: "collision-reject-three",
    portrait: "/assets/generated/profile-hardware.webp",
    name: "Ishaan",
    role: "Hardware",
    detail: "Hardware · AI/ML",
    goal: "Hackathons",
    status: "Looking for a team",
    university: "MUJ",
    decision: "rejected" as Decision,
    icon: Cpu,
  },
  {
    className: "collision-slot-three",
    portrait: "/assets/generated/profile-shreshth.webp",
    name: "Shreshth",
    role: "Product thinker",
    detail: "Product · Data",
    goal: "Sustainability",
    status: "Ready to build",
    university: "MUJ",
    decision: "accepted" as Decision,
    icon: Lightbulb,
  },
  {
    className: "collision-slot-four",
    portrait: "/assets/generated/profile-yash.webp",
    name: "Yash",
    role: "Presenter",
    detail: "Pitching · Content",
    goal: "Story · Hackathons",
    status: "Looking for a team",
    university: "MUJ",
    decision: "accepted" as Decision,
    icon: Mic2,
  },
]

const phases: Exclude<CollisionPhase, "idle">[] = ["searching", "matched", "building"]

export function CollisionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<CollisionPhase>("idle")
  const [activeProfile, setActiveProfile] = useState(0)
  const [pressedDecision, setPressedDecision] = useState<Decision | null>(null)
  useJaliSway(sectionRef)

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
        profiles.forEach((profile, index) => {
          const start = index * 820
          timers.push(window.setTimeout(() => setActiveProfile(index), start))
          timers.push(window.setTimeout(() => setPressedDecision(profile.decision), start + 390))
          timers.push(window.setTimeout(() => setPressedDecision(null), start + 790))
        })
        timers.push(window.setTimeout(() => setPhase("matched"), 5900))
        timers.push(window.setTimeout(() => setPhase("building"), 6800))
        observer.disconnect()
      },
      { threshold: 0.24 },
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
        <h2 id="collision-title">Your next great team is already here.</h2>
        <p>Swipe to find your people!</p>
        <div className="collision-status" aria-live="polite" aria-label={"Team status: " + phase}>
          {phases.map((item) => (
            <span className={phase === item ? "is-current" : ""} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="collision-stage" aria-label="Seven profiles are reviewed and four MUJ builders form a team">
        <svg className="collision-network" viewBox="0 0 900 700" aria-hidden="true">
          <path pathLength="1" d="M146 150C258 220 352 284 450 350" />
          <path pathLength="1" d="M754 150C642 220 548 284 450 350" />
          <path pathLength="1" d="M146 550C258 486 352 416 450 350" />
          <path pathLength="1" d="M754 550C642 486 548 416 450 350" />
          <path className="collision-pulse" pathLength="1" d="M146 150C300 258 600 442 754 550" />
        </svg>

        <div className="collision-core">
          <BrandMark className="collision-mark" />
          <strong>PairUp</strong>
        </div>

        {profiles.map(({ className, portrait, name, role, detail, goal, status, university, decision, icon: Icon }, index) => (
          <article
            className={"collision-card " + className + " is-" + decision}
            aria-hidden={phase === "building" && decision === "rejected"}
            key={name ?? role}
            style={{ "--swipe-delay": String(index * 0.82) + "s" } as CSSProperties}
          >
            <header className="collision-profile-header">
              <span><BrandMark /> PairUp</span>
              <span>PROFILE {String(index + 1).padStart(2, "0")}</span>
            </header>

            <div className="collision-profile-photo" aria-label="Profile portrait">
              <img src={portrait} alt="" loading="lazy" decoding="async" />
              <span className="collision-photo-role"><Icon /></span>
            </div>

            <div className="collision-profile-body">
              <div className="collision-profile-title">
                <span>{status}</span>
                <h3>{name ?? role}</h3>
                <p>{role} · {detail}</p>
              </div>

              <div className="collision-profile-fields">
                <div>
                  <span>Name</span>
                  <strong>{name ?? role}</strong>
                </div>
                <div>
                  <span>College</span>
                  <strong>{university}</strong>
                </div>
              </div>

              <div className="collision-profile-foot">
                <span>{goal}</span>
                <strong>{university}</strong>
              </div>
            </div>
          </article>
        ))}

        <div
          className="collision-controls"
          aria-label={"Profile decision controls for " + (profiles[activeProfile].name ?? profiles[activeProfile].role)}
        >
          <button
            className={"collision-control collision-control-reject" + (pressedDecision === "rejected" ? " is-pressed" : "")}
            type="button"
            tabIndex={-1}
            aria-label="Reject profile"
          >
            <X />
          </button>
          <button
            className={"collision-control collision-control-accept" + (pressedDecision === "accepted" ? " is-pressed" : "")}
            type="button"
            tabIndex={-1}
            aria-label="Accept profile"
          >
            <Check />
          </button>
        </div>
      </div>
    </section>
  )
}
