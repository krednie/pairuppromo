import { useEffect, useState } from "react"

const voices = [
  { label: "THE IDEA PERSON", quote: "I have the idea. I need someone who can build it.", mark: "ID" },
  { label: "THE DEVELOPER", quote: "I can code, but I need a designer.", mark: "DV" },
  { label: "THE HACKATHON BUILDER", quote: "I want to join hackathons, but I never find the right team.", mark: "HK" },
  { label: "THE SPECIALIST", quote: "I have skills. I just don't know the right people.", mark: "SK" },
  { label: "THE AMBITIOUS STUDENT", quote: "I'm ready to build something beyond assignments.", mark: "BU" },
]

const skills = [
  { name: "Idea", className: "skill-idea", phase: "one", x: -150, y: -65 },
  { name: "Frontend", className: "skill-frontend", phase: "one", x: -180, y: 28 },
  { name: "React", className: "skill-react", phase: "one", x: -130, y: 75 },
  { name: "Backend", className: "skill-backend", phase: "one", x: 170, y: -44 },
  { name: "UI/UX", className: "skill-design", phase: "two", x: 190, y: -72 },
  { name: "Product", className: "skill-product", phase: "two", x: -160, y: 45 },
  { name: "Pitching", className: "skill-pitch", phase: "two", x: 145, y: 58 },
  { name: "AI/ML", className: "skill-ai", phase: "two", x: 175, y: 32 },
  { name: "Research", className: "skill-research", phase: "three", x: -165, y: -48 },
  { name: "Mobile", className: "skill-mobile", phase: "three", x: 170, y: 38 },
  { name: "Data", className: "skill-data", phase: "three", x: -145, y: 62 },
  { name: "Video", className: "skill-video", phase: "three", x: 160, y: -55 },
  { name: "Content", className: "skill-content", phase: "three", x: 130, y: 64 },
  { name: "Hardware", className: "skill-hardware", phase: "three", x: -165, y: 24 },
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
          <span className="looking-index">02</span>
          <div>
            <p>Everyone is looking for someone</p>
            <h2 id="looking-title">You are not the only one struggling to find the right people.</h2>
          </div>
        </header>

        <div className="looking-signal-field" aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <path className="looking-link looking-link-idea" pathLength="1" d="M168 286C365 212 500 336 700 444" />
            <path className="looking-link looking-link-developer" pathLength="1" d="M700 444C865 319 1030 278 1265 325" />
            <path className="looking-link looking-link-designer" pathLength="1" d="M918 615C1078 557 1170 490 1301 438" />
          </svg>
          {skills.map((skill) => (
            <span
              className={"looking-skill " + skill.className}
              data-phase={skill.phase}
              data-start-x={skill.x}
              data-start-y={skill.y}
              key={skill.name}
              style={{ animationDelay: String((skills.indexOf(skill) % 7) * -0.7) + "s" }}
            >
              <i />
              {skill.name}
            </span>
          ))}
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

