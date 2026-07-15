import { useEffect, useRef, useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Check, X } from "lucide-react"
import { BrandMark } from "./BrandMark"

type JoinDialogProps = {
  open: boolean
  onClose: () => void
}

export function JoinDialog({ open, onClose }: JoinDialogProps) {
  const [contact, setContact] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 260)
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.body.classList.add("dialog-open")
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", closeOnEscape)
      document.body.classList.remove("dialog-open")
    }
  }, [open, onClose])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = contact.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    const phoneDigits = value.replace(/\D/g, "")
    const isPhone = phoneDigits.length >= 8 && phoneDigits.length <= 15

    if (!isEmail && !isPhone) {
      setError("Enter a valid email or phone number.")
      return
    }

    window.localStorage.setItem("pairup-preview-contact", value)
    setError("")
    setSubmitted(true)
  }

  const close = () => {
    onClose()
    window.setTimeout(() => {
      setSubmitted(false)
      setError("")
    }, 300)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) close()
          }}
        >
          <motion.div
            className="join-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-dialog-title"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          >
            <button
              className="dialog-close"
              type="button"
              onClick={close}
              aria-label="Close"
              title="Close"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <>
                <div className="dialog-mark-wrap">
                  <BrandMark className="dialog-mark" />
                </div>
                <p className="dialog-kicker">THE FOUNDING CIRCLE</p>
                <h2 id="join-dialog-title">Claim your Founding Builder badge.</h2>
                <p className="dialog-copy">
                  Join early and receive a limited Founding Builder badge.
                </p>
                <form className="join-form" onSubmit={submit} noValidate>
                  <label htmlFor="join-contact">Email or phone number</label>
                  <div className="join-input-row">
                    <input
                      ref={inputRef}
                      id="join-contact"
                      type="text"
                      value={contact}
                      onChange={(event) => {
                        setContact(event.target.value)
                        if (error) setError("")
                      }}
                      placeholder="Email or phone number"
                      autoComplete="email"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "join-contact-error" : undefined}
                    />
                    <button
                      type="submit"
                      aria-label="Join the founding circle"
                      title="Join the founding circle"
                    >
                      <ArrowRight size={19} />
                    </button>
                  </div>
                  {error ? (
                    <p id="join-contact-error" className="form-error" role="alert">
                      {error}
                    </p>
                  ) : (
                    <p className="form-note">Free to join.</p>
                  )}
                </form>
              </>
            ) : (
              <motion.div
                className="dialog-success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="success-icon"><Check size={20} /></span>
                <p className="dialog-kicker">SIGNAL RECEIVED</p>
                <h2 id="join-dialog-title">You&apos;re officially a Founding Builder.</h2>
                <p className="dialog-copy">
                  We saved <strong>{contact}</strong>. Your badge preview and referral
                  link come next.
                </p>
                <button className="success-close" type="button" onClick={close}>
                  Back to PairUp
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
