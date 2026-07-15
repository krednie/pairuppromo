import { useEffect, useState } from "react"

const voices = [
  {
    label: "Yash Y.",
    quote: "I have the idea. I need someone who can build it.",
    mark: "YY",
    skills: ["Idea", "Frontend", "Backend", "React"],
  },
  {
    label: "Hriday kad.",
    quote: "I can code, but I need a designer.",
    mark: "HK",
    skills: ["React", "UI/UX", "Research", "Product"],
  },
  {
    label: "Mishra S.",
    quote: "I want to join hackathons, but I never find the right team.",
    mark: "MS",
    skills: ["AI/ML", "Pitching", "Product", "Hardware"],
  },
  {
    label: "Aditya Ray.",
    quote: "I have skills. I just don't know the right people.",
    mark: "AR",
    skills: ["Research", "Data", "Mobile", "Content"],
  },
  {
    label: "Aarav M.",
    quote: "I'm ready to build something beyond assignments.",
    mark: "AM",
    skills: ["Video", "Hardware", "Backend", "AI/ML"],
  },
]

function voicePosition(index: number, activeIndex: number) {
  if (index === activeIndex) return " is-active"
  if (index === (activeIndex + 1) % voices.length) return " is-next"
  if (index === (activeIndex - 1 + voices.length) % voices.length) return " is-previous"
  return " is-away"
}

export function EveryoneLookingSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % voices.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="signals" className="looking-section" aria-labelledby="looking-title">
      <div className="looking-sticky">
        <header className="looking-header">
          <p>Everyone is looking for someone</p>
          <h2 id="looking-title">You are not the only one struggling to find the right people.</h2>
        </header>

        <div className="looking-signal-field" aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <path className="looking-link looking-link-idea" pathLength="1" d="M168 286C365 212 500 336 700 444" />
            <path className="looking-link looking-link-developer" pathLength="1" d="M700 444C865 319 1030 278 1265 325" />
            <path className="looking-link looking-link-designer" pathLength="1" d="M918 615C1078 557 1170 490 1301 438" />
          </svg>
          <div className="looking-skill-set" key={activeIndex}>
            {voices[activeIndex].skills.map((skill, index) => (
              <span
                className={"looking-skill looking-skill-slot-" + (index + 1)}
                style={{ animationDelay: String(index * 0.09) + "s" }}
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="looking-voices">
          {voices.map((voice, index) => (
            <article
              id={"looking-voice-" + (index + 1)}
              className={"looking-voice" + voicePosition(index, activeIndex)}
              key={voice.label}
            >
              <span className="looking-voice-mark">{voice.mark}</span>
              <div className="looking-voice-copy">
                <p>{voice.label}</p>
                <blockquote>“{voice.quote}”</blockquote>
                <span>{String(index + 1).padStart(2, "0")} / {String(voices.length).padStart(2, "0")}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
