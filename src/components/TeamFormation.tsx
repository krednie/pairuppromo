import { ConstellationField } from "./ConstellationField"

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

        <div className="formation-stage formation-constellation-stage">
          <ConstellationField />
        </div>
      </div>
    </section>
  )
}
