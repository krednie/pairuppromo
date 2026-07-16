import { useEffect, type RefObject } from "react"

export function useJaliSway<T extends HTMLElement>(ref: RefObject<T | null>, maxOffset = 12) {
  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const render = () => {
      currentX += (targetX - currentX) * 0.11
      currentY += (targetY - currentY) * 0.11
      element.style.setProperty("--jali-x", `${currentX.toFixed(2)}px`)
      element.style.setProperty("--jali-y", `${currentY.toFixed(2)}px`)

      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        frame = window.requestAnimationFrame(render)
      } else {
        frame = 0
      }
    }

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect()
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * maxOffset * 2
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * maxOffset * 2
      requestRender()
    }

    const handlePointerLeave = () => {
      targetX = 0
      targetY = 0
      requestRender()
    }

    element.addEventListener("pointermove", handlePointerMove, { passive: true })
    element.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      element.removeEventListener("pointermove", handlePointerMove)
      element.removeEventListener("pointerleave", handlePointerLeave)
      window.cancelAnimationFrame(frame)
      element.style.removeProperty("--jali-x")
      element.style.removeProperty("--jali-y")
    }
  }, [maxOffset, ref])
}
