import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { EmptySpaceHero } from "./components/chapter-one/EmptySpaceHero"
import { EveryoneLookingSection } from "./components/chapter-two/EveryoneLookingSection"
import { CollisionSection } from "./components/CollisionSection"
import { MomentumSection } from "./components/MomentumSection"
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

      if (reducedMotion) {
        gsap.set(".empty-space-opening, .empty-space-brand, .empty-space-title-line > span, .empty-space-magnetic-zone, .empty-space-secondary, .empty-space-scroll, .majestic-builder, .majestic-terrain", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        })
        return
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
      intro
        .from(".empty-space-brand", { opacity: 0, filter: "blur(10px)", duration: 0.6 })
        .from(".empty-space-title-line > span", {
          yPercent: 0,
          opacity: 0,
          filter: "blur(18px)",
          duration: 1.05,
          stagger: 0.12,
        }, 0.18)
        .from(".empty-space-opening", { opacity: 0, filter: "blur(6px)", duration: 0.62 }, 0.72)
        .from(".empty-space-magnetic-zone", { opacity: 0, filter: "blur(5px)", duration: 0.58 }, 0.88)
        .from(".empty-space-secondary", { opacity: 0, duration: 0.52 }, 1.12)
        .from(".empty-space-scroll", { opacity: 0, duration: 0.48 }, 1.28)

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
        <MomentumSection />
        <SwipeJoinSection />
      </main>

    </div>
  )
}
