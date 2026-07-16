import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react"
import { Check, MoveRight, X } from "lucide-react"
import { BrandMark } from "./BrandMark"

function ProfileArtwork() {
  return (
    <div className="swipe-profile-art" aria-hidden="true">
      <svg viewBox="0 0 520 280" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="profile-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          </pattern>
          <clipPath id="profile-figure-clip">
            <circle cx="260" cy="100" r="54" />
            <path d="M144 278c9-79 52-119 116-119s107 40 116 119H144Z" />
          </clipPath>
        </defs>
        <path className="profile-orbit profile-orbit-a" d="M-8 224C96 123 181 244 281 159c77-65 132-54 248-130" />
        <path className="profile-orbit profile-orbit-b" d="M-22 76c118 68 203 48 266-8 97-87 166 6 302-45" />
        <circle className="profile-ring" cx="260" cy="110" r="86" />
        <g clipPath="url(#profile-figure-clip)">
          <rect width="520" height="280" className="profile-figure" />
          <rect width="520" height="280" fill="url(#profile-dots)" className="profile-figure-dots" />
          <path className="profile-figure-sweep" d="M70 255 320 20l143 51-249 235Z" />
        </g>
        <circle className="profile-signal profile-signal-a" cx="88" cy="68" r="5" />
        <circle className="profile-signal profile-signal-b" cx="436" cy="193" r="8" />
        <circle className="profile-signal profile-signal-c" cx="404" cy="51" r="3" />
      </svg>
      <span className="swipe-art-mark"><BrandMark /></span>
      <span className="swipe-art-index">01</span>
    </div>
  )
}

function stopCardDrag(event: ReactPointerEvent<HTMLElement>) {
  event.stopPropagation()
}

export function SwipeJoinSection() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [errorField, setErrorField] = useState<"name" | "phone" | "">("")
  const [phase, setPhase] = useState<"idle" | "saving" | "leaving" | "joined">("idle")
  const [dragging, setDragging] = useState(false)
  const [nameEditorReady, setNameEditorReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [0, 260], [0, 4.8])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNameEditorReady(true)
          observer.disconnect()
        }
      },
      { threshold: 0.22 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const resetCard = () => {
    animate(x, 0, { type: "spring", stiffness: 420, damping: 34 })
  }

  const clearProfile = () => {
    setName("")
    setPhone("")
    setError("")
    setErrorField("")
    resetCard()
    window.setTimeout(() => nameRef.current?.focus(), 100)
  }

  const join = async () => {
    if (phase !== "idle") return

    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    const digits = cleanPhone.replace(/\D/g, "")

    if (cleanName.length < 2) {
      setError("Enter your name.")
      setErrorField("name")
      resetCard()
      window.setTimeout(() => nameRef.current?.focus(), 120)
      return
    }

    if (digits.length < 8 || digits.length > 15) {
      setError("Enter a valid phone number.")
      setErrorField("phone")
      resetCard()
      window.setTimeout(() => phoneRef.current?.focus(), 120)
      return
    }

    setError("")
    setErrorField("")
    setPhase("saving")

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cleanName, phone: cleanPhone }),
      })

      if (!response.ok) {
        throw new Error("Signup request failed")
      }
    } catch {
      setPhase("idle")
      setError("Could not save your profile. Try again.")
      setErrorField("")
      resetCard()
      return
    }

    window.localStorage.setItem("pairup-swipe-name", cleanName)
    window.localStorage.setItem("pairup-swipe-phone", cleanPhone)
    setPhase("leaving")

    if (!reducedMotion) {
      await animate(x, Math.max(window.innerWidth * 0.72, 620), {
        duration: 0.42,
        ease: "easeOut",
      })
    }

    x.set(0)
    setPhase("joined")
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void join()
  }

  const finishDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setDragging(false)
    if (info.offset.x > 118 || info.velocity.x > 650) {
      void join()
      return
    }
    resetCard()
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.key === "ArrowRight") {
      event.preventDefault()
      void join()
    }
  }

  const clearError = () => {
    if (error) {
      setError("")
      setErrorField("")
    }
  }

  return (
    <section
      ref={sectionRef}
      id="join"
      className={"swipe-join-section bg-pairup-paper text-pairup-ink" + (nameEditorReady ? " is-name-ready" : "")}
      aria-labelledby="swipe-join-title"
    >
      <div className="swipe-join-sticky mx-auto grid min-h-svh w-full max-w-[1440px] items-center">
        <div className="swipe-join-copy">
          <div className="swipe-section-meta">
            <span>03</span>
            <span>YOUR FOUNDING PROFILE</span>
          </div>
          <h2 id="swipe-join-title">
            Claim your <em>Founding Builder</em> badge.
          </h2>
          <p>Swipe this card to join!</p>
          <span className="swipe-copy-arrow" aria-hidden="true">
            <MoveRight />
          </span>
        </div>

        <div className="swipe-join-stage">
          <div className="swipe-join-card-shell">
            {phase === "joined" ? (
              <motion.article
                className="swipe-success-pass"
                initial={{ opacity: 0, x: -28, rotate: -1.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                aria-live="polite"
              >
                <span className="swipe-success-icon"><Check /></span>
                <p>SIGNAL RECEIVED</p>
                <h3>You&apos;re officially a Founding Builder.</h3>
                <span>{name} - {phone}</span>
                <BrandMark className="swipe-success-mark" />
              </motion.article>
            ) : (
              <>
                <motion.article
                  className={
                    "swipe-profile-card" +
                    (dragging ? " is-dragging" : "") +
                    (error ? " has-error" : "")
                  }
                  style={{ x, rotate }}
                  drag={phase === "idle" ? "x" : false}
                  dragConstraints={{ left: 0, right: 280 }}
                  dragElastic={{ left: 0.02, right: 0.16 }}
                  dragMomentum={false}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={finishDrag}
                  onKeyDown={handleCardKeyDown}
                  tabIndex={0}
                  aria-busy={phase === "saving"}
                  aria-label="Founding Builder profile card"
                >
                  <header className="swipe-card-header">
                    <span className="swipe-card-brand"><BrandMark /> PairUp</span>
                    <span>EARLY ACCESS / 001</span>
                  </header>

                  <ProfileArtwork />

                  <div className="swipe-card-body">
                    <form className="swipe-profile-form" onSubmit={submit} noValidate>
                      <div className="swipe-card-title-row">
                        <div className="swipe-card-identity">
                          <span>FOUNDING BUILDER</span>
                          <div className="swipe-name-editor" onPointerDown={stopCardDrag}>
                            <span className="swipe-name-erasing" aria-hidden="true">
                              <strong>Your profile</strong>
                              <i className="swipe-edit-cursor" />
                            </span>
                            <label className="swipe-name-input" htmlFor="swipe-name">
                              <span>Name</span>
                              <input
                                ref={nameRef}
                                id="swipe-name"
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={(event) => {
                                  setName(event.target.value)
                                  clearError()
                                }}
                                placeholder="Your name"
                                tabIndex={nameEditorReady ? 0 : -1}
                                aria-invalid={errorField === "name"}
                                aria-describedby={error ? "swipe-profile-error" : undefined}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="swipe-phone-field">
                        <label htmlFor="swipe-phone">Phone number</label>
                        <div className="swipe-phone-row" onPointerDown={stopCardDrag}>
                          <input
                            ref={phoneRef}
                            id="swipe-phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(event) => {
                              setPhone(event.target.value)
                              clearError()
                            }}
                            placeholder="Phone number"
                            aria-invalid={errorField === "phone"}
                            aria-describedby={error ? "swipe-profile-error" : undefined}
                          />
                        </div>
                      </div>

                      <div className="swipe-card-feedback">
                        {error ? (
                          <p id="swipe-profile-error" role="alert">{error}</p>
                        ) : (
                          <span aria-hidden="true"><i /><i /><i /></span>
                        )}
                        <MoveRight aria-hidden="true" />
                      </div>
                    </form>
                  </div>
                </motion.article>

                <div className="swipe-card-actions" aria-label="Profile actions">
                  <button
                    className="swipe-card-action swipe-card-reject"
                    type="button"
                    onClick={clearProfile}
                    disabled={phase === "saving"}
                    aria-label="Clear profile"
                    title="Clear profile"
                  >
                    <X />
                  </button>
                  <button
                    className="swipe-card-action swipe-card-accept"
                    type="button"
                    onClick={() => void join()}
                    disabled={phase === "saving"}
                    aria-label="Join PairUp"
                    title="Join PairUp"
                  >
                    <Check />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
