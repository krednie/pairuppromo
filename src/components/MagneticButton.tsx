import { useRef, type ButtonHTMLAttributes, type PointerEvent } from "react"

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function MagneticButton({
  children,
  className = "",
  onPointerMove,
  onPointerLeave,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMove = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event)
    if (!buttonRef.current || window.matchMedia("(pointer: coarse)").matches) return

    const bounds = buttonRef.current.getBoundingClientRect()
    const x = event.clientX - bounds.left - bounds.width / 2
    const y = event.clientY - bounds.top - bounds.height / 2
    buttonRef.current.style.transform =
      "translate3d(" + x * 0.11 + "px, " + y * 0.15 + "px, 0)"
  }

  const handleLeave = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event)
    if (buttonRef.current) buttonRef.current.style.transform = "translate3d(0, 0, 0)"
  }

  return (
    <button
      ref={buttonRef}
      className={"magnetic-button " + className}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {children}
    </button>
  )
}
