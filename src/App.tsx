import { lazy, Suspense } from "react"

type InfoPageKind = "about" | "privacy" | "terms" | "credits" | "not-found"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const InfoPage = lazy(() =>
  import("./components/site/InfoPage").then((module) => ({ default: module.InfoPage })),
)

function getInfoPage(pathname: string): InfoPageKind | null {
  const path = pathname.replace(/\/+$/, "") || "/"
  if (path === "/") return null
  if (path === "/about") return "about"
  if (path === "/privacy") return "privacy"
  if (path === "/terms") return "terms"
  if (path === "/credits") return "credits"
  return "not-found"
}

export default function App() {
  const infoPage = getInfoPage(window.location.pathname)
  return (
    <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
      {infoPage ? <InfoPage kind={infoPage} /> : <LandingPage />}
    </Suspense>
  )
}
