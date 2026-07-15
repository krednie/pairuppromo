import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { EmptySpaceHero } from "./components/chapter-one/EmptySpaceHero"
import { EveryoneLookingSection } from "./components/chapter-two/EveryoneLookingSection"
import { CollisionSection } from "./components/CollisionSection"
import { SwipeJoinSection } from "./components/SwipeJoinSection"
import { TeamFormation } from "./components/TeamFormation"

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [topBarVisible, setTopBarVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setTopBarVisible(window.scrollY > Math.min(window.innerHeight * 0.62, 640))
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let lenis: Lenis | null = null
    let updateLenis: ((time: number) => void) | null = null

    if (!reducedMotion) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true })
      lenis.on("scroll", ScrollTrigger.update)
      updateLenis = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(updateLenis)
      gsap.ticker.lagSmoothing(0)
    }

    const context = gsap.context(() => {
      const formationNodes = gsap.utils.toArray<HTMLElement>(".team-node")
      const compactFormation = window.innerWidth < 800 ? 0.42 : 1

      if (reducedMotion) {
        gsap.set(".empty-space-opening, .empty-space-brand, .empty-space-title-line > span, .empty-space-magnetic-zone, .empty-space-secondary, .empty-space-scroll, .majestic-builder, .majestic-terrain", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        })
        gsap.set(".team-connection", { strokeDashoffset: 0 })
        gsap.set(".formation-core, .formation-result", { opacity: 1, scale: 1 })
        return
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
      intro
        .from(".empty-space-brand", { y: -10, opacity: 0, duration: 0.72 })
        .from(".empty-space-secondary", { y: -8, opacity: 0, duration: 0.72 }, 0.12)
        .from(".empty-space-title-line > span", { yPercent: 112, opacity: 0, filter: "blur(9px)", duration: 1.05, stagger: 0.16 }, 0.3)
        .from(".empty-space-opening", { y: 10, opacity: 0, filter: "blur(6px)", duration: 0.75 }, 0.78)
        .from(".empty-space-magnetic-zone", { y: 11, opacity: 0, duration: 0.62 }, 0.88)
        .from(".majestic-terrain-rear", { y: 60, opacity: 0, duration: 1.35 }, 0.2)
        .from(".majestic-terrain-mid", { y: 72, opacity: 0, duration: 1.4 }, 0.35)
        .from(".majestic-terrain-front", { y: 54, opacity: 0, duration: 1.25 }, 0.52)
        .from(".majestic-builder", { y: 26, opacity: 0, duration: 1.05 }, 0.92)
        .from(".empty-space-scroll", { opacity: 0, y: -8, duration: 0.55 }, 1.62)

      gsap.to(".empty-space-content", {
        yPercent: 9,
        opacity: 0.42,
        ease: "none",
        scrollTrigger: {
          trigger: ".empty-space-hero",
          start: "58% center",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to(".empty-space-art", {
        yPercent: 6,
        scale: 1.025,
        ease: "none",
        scrollTrigger: {
          trigger: ".empty-space-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.set(formationNodes, {
        x: (_, element) =>
          Number((element as HTMLElement).dataset.startX || 0) * compactFormation,
        y: (_, element) =>
          Number((element as HTMLElement).dataset.startY || 0) * compactFormation,
        opacity: 0.18,
        scale: 0.84,
      })
      gsap.set(".team-connection", { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(".connection-pulse", { strokeDasharray: "0.1 0.9", strokeDashoffset: 0 })
      gsap.set(".formation-core", { opacity: 0.32, scale: 0.7, rotate: -12 })
      gsap.set(".formation-result", { opacity: 0, y: 14 })

      const formationTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".team-formation",
          start: "top 68%",
          toggleActions: "play none none none",
          once: true,
        },
      })

      formationTimeline
        .to(
          formationNodes,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.82,
            stagger: 0.11,
            ease: "power2.inOut",
          },
          0.08,
        )
        .to(
          ".team-connection",
          {
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          0.72,
        )
        .to(
          ".formation-core",
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.65,
            ease: "back.out(1.4)",
          },
          1.24,
        )
        .to(".connection-pulse", { strokeDashoffset: -1, duration: 1.1, ease: "none" }, 1.48)
        .to(".formation-result", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.82)

      const swipeHint = gsap.timeline({
        scrollTrigger: {
          trigger: ".swipe-join-section",
          start: "top 90%",
          end: "top 46%",
          scrub: 0.75,
        },
      })

      swipeHint
        .fromTo(
          ".swipe-join-card-shell",
          { x: -14, rotate: -1.1 },
          { x: 38, rotate: 1.5, duration: 0.62, ease: "none" },
        )
        .to(".swipe-join-card-shell", {
          x: 0,
          rotate: 0,
          duration: 0.38,
          ease: "none",
        })
    }, root)

    return () => {
      context.revert()
      if (updateLenis) gsap.ticker.remove(updateLenis)
      lenis?.destroy()
    }
  }, [])

  const scrollToJoin = () => {
    document.querySelector("#join")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    })
  }

  return (
    <div ref={rootRef} className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <main id="main-content">
        <EmptySpaceHero topBarVisible={topBarVisible} onJoin={scrollToJoin} />

        <EveryoneLookingSection />

        <TeamFormation />
        <CollisionSection />
        <SwipeJoinSection />
      </main>

    </div>
  )
}
