import { useEffect, useRef } from "react"

type SignalPoint = {
  u: number
  v: number
  du: number
  dv: number
  size: number
  color: string
  ring: boolean
  phase: number
}

const colors = [
  "rgba(247,247,251,0.58)",
  "rgba(123,97,255,0.72)",
  "rgba(255,117,104,0.75)",
  "rgba(93,228,255,0.58)",
]

function seededRandom(seed: number) {
  let value = seed % 2147483647
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const random = seededRandom(2411)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const points: SignalPoint[] = []
    const pointer = { x: -1000, y: -1000, active: false }
    let width = 0
    let height = 0
    let frame = 0
    let animationId = 0

    const createPoints = () => {
      points.length = 0
      const count = width < 700 ? 30 : 52
      for (let index = 0; index < count; index += 1) {
        const accent = random() > 0.77 ? 1 + Math.floor(random() * 3) : 0
        points.push({
          u: random(),
          v: random(),
          du: (random() - 0.5) * 0.000035,
          dv: (random() - 0.5) * 0.000035,
          size: accent ? 1.2 + random() * 1.3 : 0.65 + random() * 1.1,
          color: colors[accent],
          ring: accent > 0 && random() > 0.56,
          phase: random() * Math.PI * 2,
        })
      }
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      createPoints()
    }

    const handlePointer = (event: globalThis.PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active =
        pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    const draw = () => {
      frame += 1
      context.clearRect(0, 0, width, height)

      const rendered = points.map((point) => {
        if (!reducedMotion) {
          point.u += point.du
          point.v += point.dv
          if (point.u < -0.03) point.u = 1.03
          if (point.u > 1.03) point.u = -0.03
          if (point.v < -0.03) point.v = 1.03
          if (point.v > 1.03) point.v = -0.03
        }

        const baseX = point.u * width
        const baseY = point.v * height
        const dx = pointer.x - baseX
        const dy = pointer.y - baseY
        const distance = Math.hypot(dx, dy)
        const pull = pointer.active && distance < 190 ? (1 - distance / 190) * 13 : 0
        const x = baseX + (distance ? (dx / distance) * pull : 0)
        const y = baseY + (distance ? (dy / distance) * pull : 0)
        return { point, x, y }
      })

      for (let first = 0; first < rendered.length; first += 1) {
        for (let second = first + 1; second < rendered.length; second += 1) {
          const a = rendered[first]
          const b = rendered[second]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          const threshold = width < 700 ? 82 : 118
          if (distance < threshold) {
            const pointerDistance = Math.min(
              Math.hypot(pointer.x - a.x, pointer.y - a.y),
              Math.hypot(pointer.x - b.x, pointer.y - b.y),
            )
            const focus = pointer.active && pointerDistance < 210 ? 1.8 : 1
            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.strokeStyle =
              "rgba(197,198,213," + (1 - distance / threshold) * 0.09 * focus + ")"
            context.lineWidth = 0.7
            context.stroke()
          }
        }
      }

      rendered.forEach(({ point, x, y }) => {
        const pulse = 1 + Math.sin(frame * 0.012 + point.phase) * 0.14
        context.beginPath()
        context.arc(x, y, point.size * pulse, 0, Math.PI * 2)
        context.fillStyle = point.color
        context.fill()

        if (point.ring) {
          context.beginPath()
          context.arc(x, y, point.size * 4.5, 0, Math.PI * 2)
          context.strokeStyle = point.color.replace(/0\.[0-9]+\)/, "0.16)")
          context.lineWidth = 0.65
          context.stroke()
        }
      })

      if (!reducedMotion) animationId = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", handlePointer, { passive: true })
    document.addEventListener("mouseleave", handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointer)
      document.removeEventListener("mouseleave", handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />
}
