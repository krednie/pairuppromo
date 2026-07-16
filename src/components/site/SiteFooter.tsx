import { ArrowUpRight, Mail } from "lucide-react"
import { BrandMark } from "../BrandMark"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <a href="/" aria-label="PairUp home"><BrandMark /> <strong>PairUp</strong></a>
          <p>Find your dream startup circle.</p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/credits">Credits</a>
          <a href="mailto:krednie@gmail.com"><Mail /> Contact</a>
        </nav>

        <a className="site-footer-join" href="/#join">
          Join early <ArrowUpRight />
        </a>
      </div>

      <div className="site-footer-fineprint">
        <span>© {new Date().getFullYear()} PairUp</span>
        <span>Built by us. For us.</span>
        <span className="site-footer-technical">
          <a href="/robots.txt">Robots</a>
          <a href="/sitemap.xml">Sitemap</a>
        </span>
      </div>
    </footer>
  )
}
