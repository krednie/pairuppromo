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
import { Check, Copy, MoveRight, X } from "lucide-react"
import type { BadgeId } from "../../shared/badges"
import { getBadge } from "../config/badges"
import { BrandMark } from "./BrandMark"
import { CharmCarousel } from "./CharmCarousel"

type SignupPhase = "idle" | "referral" | "saving" | "leaving" | "joined"
type ErrorField = "name" | "phone" | "badge" | "referral" | ""

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
  const [website, setWebsite] = useState("")
  const [enteredReferralCode, setEnteredReferralCode] = useState("")
  const [shareReferralCode, setShareReferralCode] = useState("")
  const [referralCopied, setReferralCopied] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<BadgeId | null>(null)
  const [error, setError] = useState("")
  const [errorField, setErrorField] = useState<ErrorField>("")
  const [phase, setPhase] = useState<SignupPhase>("idle")
  const [dragging, setDragging] = useState(false)
  const [nameEditorReady, setNameEditorReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const referralRef = useRef<HTMLInputElement>(null)
  const savingRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [0, 260], [0, 4.8])
  const selectedBadgeDetails = getBadge(selectedBadge)

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

  const clearError = () => {
    if (error) {
      setError("")
      setErrorField("")
    }
  }

  const validateProfile = () => {
    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    const digits = cleanPhone.replace(/\D/g, "")

    if (cleanName.length < 2) {
      setError("Enter your name.")
      setErrorField("name")
      resetCard()
      window.setTimeout(() => nameRef.current?.focus(), 120)
      return null
    }

    if (digits.length < 8 || digits.length > 15 || !/^[+()\-\s0-9]+$/.test(cleanPhone)) {
      setError("Enter a valid phone number.")
      setErrorField("phone")
      resetCard()
      window.setTimeout(() => phoneRef.current?.focus(), 120)
      return null
    }

    return { cleanName, cleanPhone }
  }

  const clearProfile = () => {
    setName("")
    setPhone("")
    setSelectedBadge(null)
    setEnteredReferralCode("")
    setShareReferralCode("")
    setReferralCopied(false)
    setError("")
    setErrorField("")
    resetCard()
    window.setTimeout(() => nameRef.current?.focus(), 100)
  }

  const advanceToReferral = () => {
    if (phase !== "idle") return
    const profile = validateProfile()
    if (!profile) return

    if (!selectedBadge) {
      setError("Choose one charm to continue.")
      setErrorField("badge")
      resetCard()
      return
    }

    setError("")
    setErrorField("")
    resetCard()
    setPhase("referral")
    window.setTimeout(() => referralRef.current?.focus(), 180)
  }

  const returnToProfile = () => {
    if (phase === "saving") return
    setPhase("idle")
    setError("")
    setErrorField("")
    resetCard()
  }

  const saveProfile = async () => {
    if (phase !== "referral" || savingRef.current) return
    const profile = validateProfile()
    if (!profile) {
      setPhase("idle")
      return
    }

    if (!selectedBadge) {
      setError("Choose one charm to continue.")
      setErrorField("badge")
      setPhase("idle")
      resetCard()
      return
    }

    const cleanReferralCode = enteredReferralCode.trim().toUpperCase()
    if (cleanReferralCode && !/^[A-Z0-9]{6,16}$/.test(cleanReferralCode)) {
      setError("Enter a valid referral code.")
      setErrorField("referral")
      resetCard()
      window.setTimeout(() => referralRef.current?.focus(), 120)
      return
    }

    setError("")
    setErrorField("")
    savingRef.current = true
    setPhase("saving")
    resetCard()

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.cleanName,
          phone: profile.cleanPhone,
          badge: selectedBadge,
          referralCode: cleanReferralCode,
          website,
        }),
        signal: controller.signal,
      })
      const result = await response.json().catch(() => null) as { error?: string; referralCode?: string } | null

      if (!response.ok) {
        throw new Error(result?.error || "Could not save your profile. Try again.")
      }
      if (!result?.referralCode) {
        throw new Error("Could not create your referral code. Try again.")
      }
      setShareReferralCode(result.referralCode)
    } catch (requestError) {
      savingRef.current = false
      setPhase("referral")
      setError(
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "The request timed out. Try again."
          : requestError instanceof Error
            ? requestError.message
            : "Could not save your profile. Try again.",
      )
      setErrorField("")
      resetCard()
      return
    } finally {
      window.clearTimeout(timeout)
    }

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
    advanceToReferral()
  }

  const submitReferral = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void saveProfile()
  }

  const finishDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setDragging(false)
    if (info.offset.x > 118 || info.velocity.x > 650) {
      if (phase === "idle") advanceToReferral()
      if (phase === "referral") void saveProfile()
      return
    }
    resetCard()
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.key !== "ArrowRight") return
    event.preventDefault()
    if (phase === "idle") advanceToReferral()
    if (phase === "referral") void saveProfile()
  }

  const cardActions = phase !== "joined" && phase !== "leaving" ? (
    <div className="swipe-card-actions" aria-label="Profile actions">
      <button
        className="swipe-card-action swipe-card-reject"
        type="button"
        onClick={phase === "referral" ? returnToProfile : clearProfile}
        disabled={phase === "saving"}
        aria-label={phase === "referral" ? "Back to profile" : "Clear profile"}
        title={phase === "referral" ? "Back to profile" : "Clear profile"}
      >
        <X />
      </button>
      <button
        className="swipe-card-action swipe-card-accept"
        type="button"
        onClick={phase === "referral" ? () => void saveProfile() : advanceToReferral}
        disabled={phase === "saving"}
        aria-label={phase === "referral" ? "Complete signup" : "Continue to referral code"}
        title={phase === "referral" ? "Complete signup" : "Continue to referral code"}
      >
        <Check />
      </button>
    </div>
  ) : null

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
                {selectedBadgeDetails ? (
                  <span className="swipe-success-charm">
                    <img src={selectedBadgeDetails.image} alt="" />
                  </span>
                ) : (
                  <span className="swipe-success-icon"><Check /></span>
                )}
                <p>SIGNAL RECEIVED</p>
                <h3>You&apos;re officially a Founding Builder.</h3>
                <span>{name} claimed {selectedBadgeDetails?.name ?? "a founding charm"}.</span>
                {shareReferralCode ? (
                  <div className="swipe-referral-share">
                    <span>Your referral code</span>
                    <strong>{shareReferralCode}</strong>
                    <button
                      type="button"
                      aria-label="Copy referral code"
                      title="Copy referral code"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(shareReferralCode)
                          setReferralCopied(true)
                          window.setTimeout(() => setReferralCopied(false), 1800)
                        } catch {
                          setError("Select the code and copy it manually.")
                        }
                      }}
                    >
                      {referralCopied ? <Check /> : <Copy />}
                    </button>
                  </div>
                ) : null}
                <BrandMark className="swipe-success-mark" />
              </motion.article>
            ) : (
              <motion.article
                className={
                  "swipe-profile-card" +
                  (dragging ? " is-dragging" : "") +
                  (error ? " has-error" : "")
                }
                style={{ x, rotate }}
                drag={phase === "idle" || phase === "referral" ? "x" : false}
                dragConstraints={{ left: 0, right: 280 }}
                dragElastic={{ left: 0.02, right: 0.16 }}
                dragMomentum={false}
                onDragStart={() => setDragging(true)}
                onDragEnd={finishDrag}
                onKeyDown={handleCardKeyDown}
                tabIndex={0}
                aria-label="Founding Builder profile card"
                aria-busy={phase === "saving" || phase === "leaving"}
              >
                <header className="swipe-card-header">
                  <span className="swipe-card-brand"><BrandMark /> PairUp</span>
                  <span>EARLY ACCESS / 001</span>
                </header>

                {selectedBadgeDetails ? (
                  <motion.span
                    key={selectedBadgeDetails.id}
                    className="swipe-profile-charm-sticker"
                    initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    aria-label={`Selected charm: ${selectedBadgeDetails.name}`}
                  >
                    <img src={selectedBadgeDetails.image} alt="" />
                  </motion.span>
                ) : null}

                <ProfileArtwork />

                <div className="swipe-card-body">
                  {phase === "referral" || phase === "saving" ? (
                    <motion.form
                      className="swipe-referral-form"
                      onSubmit={submitReferral}
                      noValidate
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24 }}
                    >
                      <div className="swipe-referral-heading">
                        <span>FINAL STEP</span>
                        <strong>Referral code</strong>
                      </div>
                      <label htmlFor="swipe-referral">Referral code (optional)</label>
                      <div className="swipe-referral-row" onPointerDown={stopCardDrag}>
                        <input
                          ref={referralRef}
                          id="swipe-referral"
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          autoCapitalize="characters"
                          maxLength={16}
                          value={enteredReferralCode}
                          disabled={phase === "saving"}
                          onChange={(event) => {
                            setEnteredReferralCode(event.target.value.toUpperCase().replace(/\s/g, ""))
                            clearError()
                          }}
                          placeholder="Referral code"
                          aria-invalid={errorField === "referral"}
                          aria-describedby={error ? "swipe-profile-error" : undefined}
                        />
                      </div>
                      <div className="swipe-card-feedback">
                        {error ? <p id="swipe-profile-error" role="alert">{error}</p> : <span aria-hidden="true"><i /><i /><i /></span>}
                        <MoveRight aria-hidden="true" />
                      </div>
                    </motion.form>
                  ) : (
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
                              maxLength={80}
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
                          maxLength={32}
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

                    <div
                      className={"swipe-profile-charms" + (errorField === "badge" ? " has-error" : "")}
                      onPointerDown={stopCardDrag}
                    >
                      <CharmCarousel
                        variant="picker"
                        selectedId={selectedBadge}
                        disabled={phase !== "idle"}
                        onSelect={(badgeId) => {
                          setSelectedBadge(badgeId)
                          clearError()
                        }}
                      />
                    </div>

                    <label className="swipe-form-trap" aria-hidden="true">
                      Website
                      <input
                        type="text"
                        name="website"
                        autoComplete="off"
                        tabIndex={-1}
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                      />
                    </label>

                    <div className="swipe-card-feedback">
                      {error ? (
                        <p id="swipe-profile-error" role="alert">{error}</p>
                      ) : (
                        <span aria-hidden="true"><i /><i /><i /></span>
                      )}
                      <MoveRight aria-hidden="true" />
                    </div>
                    <p className="swipe-consent">
                      By joining, you agree to our <a href="/terms">Terms</a> and acknowledge our{" "}
                      <a href="/privacy">Privacy notice</a>.
                    </p>
                  </form>
                  )}
                </div>
              </motion.article>
            )}

            {cardActions}
          </div>
        </div>
      </div>
    </section>
  )
}
