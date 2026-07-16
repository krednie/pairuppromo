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
          <div className="formation-message">
            <p className="formation-hello">Hello!</p>
            <p>
              We’re building PairUp to help you connect with{" "}
              <strong>ambitious, full-of-life people</strong> at your university. You
              can find teammates for hackathons, join existing teams, or discover
              people to help bring your own ideas to life.
            </p>

            <h3>Our Motivation</h3>
            <p>
              We’ve always wondered what we could achieve if we connected with more
              amazing people at our university. The opportunities that would open up
              and the goals we dream of accomplishing could become one step closer to
              reality.
            </p>
            <p>
              We realized that almost everyone who wants to build something
              extraordinary is looking for the right people.{" "}
              <strong>Great connections can be incredibly powerful.</strong> That’s
              why our team built this app as a way to give back to this amazing
              community—to help connect people who can meaningfully transform each
              other’s lives through collaboration.
            </p>

            <p className="formation-closing">We can’t wait to see what you create.</p>
            <p className="formation-referral">
              Don’t forget to spread the word! The more people who join PairUp, the
              more opportunities there are for meaningful connections.{" "}
              <strong>Every referral counts</strong> toward unlocking custom themes
              and other exclusive perks.
            </p>
          </div>
        </div>

        <div className="formation-stage formation-constellation-stage">
          <ConstellationField />
        </div>
      </div>
    </section>
  )
}
