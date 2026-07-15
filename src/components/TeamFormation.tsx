import { Code2, Lightbulb, Mic2, Palette } from "lucide-react"
import { BrandMark } from "./BrandMark"

const roles = [
  {
    className: "team-node-developer",
    role: "Developer",
    detail: "React · Python",
    icon: Code2,
    startX: -360,
    startY: -170,
  },
  {
    className: "team-node-designer",
    role: "UI / UX",
    detail: "Figma · Research",
    icon: Palette,
    startX: 370,
    startY: -190,
  },
  {
    className: "team-node-product",
    role: "Product",
    detail: "Ideas · Strategy",
    icon: Lightbulb,
    startX: -390,
    startY: 190,
  },
  {
    className: "team-node-presenter",
    role: "Presenter",
    detail: "Pitching · Story",
    icon: Mic2,
    startX: 390,
    startY: 180,
  },
]

export function TeamFormation() {
  return (
    <section id="how-it-works" className="team-formation">
      <div className="formation-sticky">
        <div className="formation-copy">
          <h2>
            Find people who <em>complement</em> your abilities.
          </h2>
          <p className="formation-lead">Expand your circle</p>
          <p className="formation-message">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod.
          </p>
        </div>

        <div className="formation-stage" aria-label="Four complementary roles forming a team">
          <svg
            className="formation-connections"
            viewBox="0 0 700 700"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <circle cx="350" cy="350" r="226" />
            <circle className="formation-orbit-dashed" cx="350" cy="350" r="158" />
            <path className="team-connection" pathLength="1" d="M350 350C290 300 250 246 194 198" />
            <path className="team-connection" pathLength="1" d="M350 350C416 298 450 245 506 190" />
            <path className="team-connection" pathLength="1" d="M350 350C292 411 244 458 185 512" />
            <path className="team-connection" pathLength="1" d="M350 350C411 412 460 456 520 506" />
            <path className="connection-pulse" pathLength="1" d="M194 198C294 284 411 412 520 506" />
          </svg>

          <div className="formation-core">
            <BrandMark className="formation-mark" />
            <span>TEAM READY</span>
          </div>

          {roles.map(({ className, role, detail, icon: Icon, startX, startY }) => (
            <div
              className={"team-node " + className}
              data-start-x={startX}
              data-start-y={startY}
              key={role}
            >
              <span className="team-node-icon"><Icon size={18} /></span>
              <span className="team-node-copy">
                <strong>{role}</strong>
                <small>{detail}</small>
              </span>
            </div>
          ))}

          <div className="formation-result" aria-hidden="true">
            <span>COMPLEMENTARY SKILLS</span>
            <strong>4 / 4</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
