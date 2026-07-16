import { ArrowLeft, Mail } from "lucide-react"
import { BrandMark } from "../BrandMark"
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata"
import { SiteFooter } from "./SiteFooter"

export type InfoPageKind = "about" | "privacy" | "terms" | "credits" | "not-found"

const pageMetadata: Record<InfoPageKind, { title: string; description: string }> = {
  about: {
    title: "About PairUp",
    description: "Why PairUp is building a better way for university builders to find their people.",
  },
  privacy: {
    title: "Privacy - PairUp",
    description: "How PairUp collects, uses, protects, and deletes early-access signup data.",
  },
  terms: {
    title: "Terms - PairUp",
    description: "Terms for using the PairUp early-access website and matching service.",
  },
  credits: {
    title: "Credits - PairUp",
    description: "Credits and rights notes for third-party references used in the PairUp prototype.",
  },
  "not-found": {
    title: "Page not found - PairUp",
    description: "The requested PairUp page could not be found.",
  },
}

function AboutContent() {
  return (
    <>
      <p className="info-page-lede">
        PairUp helps ambitious, full-of-life people at the same university find one another and build together.
      </p>
      <section>
        <h2>Why we built it</h2>
        <p>
          We kept wondering what we could achieve if it were easier to meet more amazing people at our university.
          The ideas already existed. So did the developers, designers, presenters, researchers, and determined
          builders. They were simply scattered.
        </p>
        <p>
          PairUp is our way of bringing those people into the same circle. You can find teammates for hackathons,
          join an existing team, or discover someone who can help bring your own idea to life.
        </p>
      </section>
      <section>
        <h2>What comes next</h2>
        <p>
          This is an early-access community and matching service. The more university builders who join, the more
          useful every introduction becomes. We cannot wait to see what you create.
        </p>
      </section>
    </>
  )
}

function PrivacyContent() {
  return (
    <>
      <p className="info-page-lede">
        This notice explains what PairUp collects during early access, why we collect it, and how to ask us to delete it.
      </p>
      <section>
        <h2>Data we collect</h2>
        <p>
          When you join, we collect your name, phone number, normalized phone number, selected founding charm,
          signup source, and creation and update timestamps. We may also receive basic technical request data from
          our hosting and database providers for security and reliability.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>
          We use this information to manage early access, prevent duplicate signups, contact you about PairUp,
          operate future university matching, and protect the service from misuse. We do not sell your personal data.
        </p>
      </section>
      <section>
        <h2>Storage and sharing</h2>
        <p>
          The website is hosted by Vercel and signup records are stored with Neon. We share data only with service
          providers needed to run PairUp, when required by law, or to protect users and the service.
        </p>
      </section>
      <section>
        <h2>Retention and deletion</h2>
        <p>
          We retain signup data while it is needed for early access and matching, or until you ask us to delete it.
          To access, correct, or delete your record, email <a href="mailto:krednie@gmail.com">krednie@gmail.com</a>
          from a contact method we can reasonably verify.
        </p>
      </section>
      <section>
        <h2>Security and choices</h2>
        <p>
          We use reasonable safeguards and restrict direct database access, but no internet service can promise
          absolute security. If you are below the age of majority where you live, use PairUp with a parent or
          guardian&apos;s permission.
        </p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>
          We may update this notice as PairUp develops. Material changes will be reflected here with a revised date.
        </p>
      </section>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <p className="info-page-lede">
        These terms apply to the PairUp early-access website and the university matching service we are building.
      </p>
      <section>
        <h2>Early access</h2>
        <p>
          PairUp is a pre-launch service. Features, availability, matching criteria, badges, perks, and launch timing
          may change. Joining does not guarantee a match, admission to a specific programme, or uninterrupted access.
        </p>
      </section>
      <section>
        <h2>Your information</h2>
        <p>
          Submit accurate information that belongs to you and keep your contact details current. You are responsible
          for the information you provide and for having permission to provide it.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>
          Do not impersonate others, scrape the service, interfere with its operation, submit malicious content, or
          use PairUp to harass, discriminate against, deceive, or exploit another person.
        </p>
      </section>
      <section>
        <h2>Ownership and references</h2>
        <p>
          PairUp&apos;s name, interface, artwork, and original content belong to PairUp or its licensors. Founding charms
          may refer to third-party products or cultural objects. PairUp is not affiliated with or endorsed by those
          trademark owners, and all third-party marks remain their owners&apos; property.
        </p>
      </section>
      <section>
        <h2>Service limits</h2>
        <p>
          The service is provided as available during early access. To the extent permitted by law, PairUp is not
          responsible for indirect losses, missed opportunities, user conduct, or decisions made from a match.
          Nothing here limits rights that cannot legally be limited.
        </p>
      </section>
      <section>
        <h2>Ending access and changes</h2>
        <p>
          We may suspend misuse or change these terms as the service evolves. Continued use after an update means you
          accept the revised terms. These terms are governed by the laws of India, subject to applicable consumer law.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions can be sent to <a href="mailto:krednie@gmail.com">krednie@gmail.com</a>.</p>
      </section>
    </>
  )
}

const credits = [
  ["Diet Coke bottle", "Connor J Williams / CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Diet_coke_1.jpg"],
  ["Scrunchies", "Battyboy663 / CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Vaga-scrunchie-render.webp"],
  ["Teddy bear", "Mushii / CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Teddy_bear.svg"],
  ["Cheeseburger", "Renee Comet, US National Cancer Institute / public domain", "https://commons.wikimedia.org/wiki/File:Cheeseburger.jpg"],
  ["Eiffel Tower silhouette", "GDJ / CC0 1.0", "https://commons.wikimedia.org/wiki/File:Eiffel_Tower_Silhouette.svg"],
] as const

function CreditsContent() {
  return (
    <>
      <p className="info-page-lede">
        PairUp uses a small set of credited open-media assets and prototype product references in its founding charm shelf.
      </p>
      <section>
        <h2>Open-media credits</h2>
        <ul className="info-credits-list">
          {credits.map(([name, credit, url]) => (
            <li key={name}>
              <a href={url} target="_blank" rel="noreferrer">{name}</a>
              <span>{credit}. The displayed file was resized and, where needed, rasterized or cropped.</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Product references</h2>
        <p>
          Diet Coke, Air Jordan, Porsche, Koenigsegg, Anastasia Beverly Hills, Machete, and their related names and
          designs are third-party property. Product references are used as prototype charm concepts only. PairUp is
          not affiliated with or endorsed by those owners.
        </p>
      </section>
    </>
  )
}

export function InfoPage({ kind }: { kind: InfoPageKind }) {
  const metadata = pageMetadata[kind]
  const pageTitle = kind === "not-found" ? "Nothing here yet." : metadata.title.replace(" - PairUp", "")
  useDocumentMetadata(metadata.title, metadata.description, kind === "not-found" ? window.location.pathname : `/${kind}`)

  return (
    <div className="info-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="info-header">
        <a className="info-brand" href="/" aria-label="PairUp home"><BrandMark /> <strong>PairUp</strong></a>
        <a className="info-back" href="/"><ArrowLeft /> Back home</a>
      </header>

      <main id="main-content" className="info-page">
        <div className="info-page-heading">
          <span>{kind === "not-found" ? "404" : "PAIRUP / INFO"}</span>
          <h1>{pageTitle}</h1>
          {kind !== "not-found" && <time dateTime="2026-07-16">Updated 16 July 2026</time>}
        </div>

        <article className="info-page-content">
          {kind === "about" && <AboutContent />}
          {kind === "privacy" && <PrivacyContent />}
          {kind === "terms" && <TermsContent />}
          {kind === "credits" && <CreditsContent />}
          {kind === "not-found" && (
            <p className="info-page-lede">
              The page you asked for does not exist. Go back to PairUp or email us at{" "}
              <a href="mailto:krednie@gmail.com"><Mail /> krednie@gmail.com</a>.
            </p>
          )}
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
