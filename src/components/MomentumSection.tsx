import { useEffect, useRef, useState } from "react"
import { momentumConfig } from "../config/momentum"

function activityPosition(index: number, activeIndex: number) {
  const distance = (index - activeIndex + momentumConfig.activities.length) % momentumConfig.activities.length
  if (distance === 0) return " is-current"
  if (distance === 1) return " is-next"
  if (distance === 2) return " is-next-two"
  if (distance === momentumConfig.activities.length - 1) return " is-previous"
  return " is-away"
}

const emptyCounts = Object.fromEntries(
  momentumConfig.metrics.map((metric) => [metric.id, 0]),
) as Record<(typeof momentumConfig.metrics)[number]["id"], number>

export function MomentumSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)
  const [activeActivity, setActiveActivity] = useState(0)
  const [counts, setCounts] = useState(emptyCounts)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let activityTimer = 0

    const begin = () => {
      setStarted(true)

      if (reducedMotion) {
        setCounts(Object.fromEntries(
          momentumConfig.metrics.map((metric) => [metric.id, metric.value]),
        ) as typeof emptyCounts)
        return
      }

      const startTime = performance.now()
      const tick = (time: number) => {
        const progress = Math.min((time - startTime) / 1400, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCounts(Object.fromEntries(
          momentumConfig.metrics.map((metric) => [metric.id, Math.round(metric.value * eased)]),
        ) as typeof emptyCounts)
        if (progress < 1) frame = window.requestAnimationFrame(tick)
      }

      frame = window.requestAnimationFrame(tick)
      activityTimer = window.setInterval(() => {
        setActiveActivity((current) => (current + 1) % momentumConfig.activities.length)
      }, 2600)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        begin()
        observer.disconnect()
      },
      { threshold: 0.24 },
    )

    observer.observe(section)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      window.clearInterval(activityTimer)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="momentum"
      className={"momentum-section" + (started ? " is-active" : "")}
      aria-labelledby="momentum-title"
    >
      <header className="momentum-heading">
        <h2 id="momentum-title">Something is already forming.</h2>
      </header>

      <div className="momentum-metrics" aria-label="PairUp pre-launch momentum">
        {momentumConfig.metrics.map((metric) => (
          <div className="momentum-metric" key={metric.id}>
            <strong>{counts[metric.id]}{metric.suffix}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="momentum-scene">
        <div className="momentum-activity" aria-live="polite">
          {momentumConfig.activities.map((activity, index) => {
            const position = activityPosition(index, activeActivity)
            return (
              <article
                className={"momentum-activity-item" + position}
                key={activity.id}
              >
                <span className="momentum-activity-avatar">{activity.signal}</span>
                <p>{activity.message}</p>
              </article>
            )
          })}
        </div>

        <div className="momentum-signal-map" aria-hidden="true">
          <svg viewBox="0 0 660 330" preserveAspectRatio="none">
            <path pathLength="1" d="M70 242C198 86 324 264 590 82" />
            <path pathLength="1" d="M64 88C217 196 408 52 602 234" />
          </svg>
          {[0, 1, 2].map((index) => (
            <span className={"momentum-signal momentum-signal-" + (index + 1)} key={index}>
              <i />
            </span>
          ))}
        </div>
      </div>

      <div className="momentum-skills" aria-label="Skills PairUp will support at launch">
        <div className="momentum-skills-track">
          {[...momentumConfig.skills, ...momentumConfig.skills].map((skill, index) => (
            <span aria-hidden={index >= momentumConfig.skills.length} key={skill + index}>{skill}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
