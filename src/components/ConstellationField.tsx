import { useEffect, useRef } from "react"

type Point = {
  x: number
  y: number
}

type Star = Point & {
  alpha: number
  phase: number
  size: number
  speed: number
}

const constellationPatterns: Point[][] = [
  [
    { x: 0.12, y: 0.24 },
    { x: 0.72, y: 0.67 },
  ],
  [
    { x: 0.18, y: 0.24 },
    { x: 0.78, y: 0.29 },
    { x: 0.47, y: 0.77 },
  ],
  [
    { x: 0.12, y: 0.27 },
    { x: 0.73, y: 0.16 },
    { x: 0.84, y: 0.73 },
    { x: 0.3, y: 0.82 },
  ],
  [
    { x: 0.11, y: 0.31 },
    { x: 0.48, y: 0.12 },
    { x: 0.86, y: 0.34 },
    { x: 0.72, y: 0.82 },
    { x: 0.24, y: 0.76 },
  ],
  [
    { x: 0.2, y: 0.19 },
    { x: 0.82, y: 0.42 },
    { x: 0.37, y: 0.82 },
  ],
]

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(Math.max(value, minimum), maximum)
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function seededNoise(index: number) {
  const value = Math.sin(index * 91.731 + 17.17) * 43758.5453
  return value - Math.floor(value)
}

function mapPatternPoint(point: Point, width: number, height: number, lane: number): Point {
  if (width >= 820) {
    return {
      x: width * (0.52 + point.x * 0.43),
      y: height * ((lane === 0 ? 0.08 : 0.54) + point.y * 0.36),
    }
  }

  return {
    x: width * ((lane === 0 ? 0.06 : 0.54) + point.x * 0.4),
    y: height * (0.52 + point.y * 0.43),
  }
}

function drawProfile(context: CanvasRenderingContext2D, point: Point, progress: number, maxRadius: number) {
  const radius = 3 + progress * maxRadius
  context.save()
  context.globalAlpha *= 0.18 + progress * 0.82
  context.fillStyle = "#e98b7f"
  context.beginPath()
  context.arc(point.x, point.y, radius, 0, Math.PI * 2)
  context.fill()

  if (progress > 0.3) {
    const portraitAlpha = clamp((progress - 0.3) / 0.7)
    context.globalAlpha *= portraitAlpha * 0.92
    context.fillStyle = "#f1edda"
    context.beginPath()
    context.arc(point.x, point.y - radius * 0.22, radius * 0.24, 0, Math.PI * 2)
    context.fill()
    context.beginPath()
    context.arc(point.x, point.y + radius * 0.58, radius * 0.48, Math.PI, 0)
    context.fill()
  }

  context.restore()
}

function drawShootingHead(
  context: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  progress: number,
) {
  const head = {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  }
  const length = Math.hypot(end.x - start.x, end.y - start.y)
  const tailFraction = Math.min(34 / Math.max(length, 1), progress)

  for (let index = 7; index >= 0; index -= 1) {
    const fraction = tailFraction * (index / 7)
    const x = head.x - (end.x - start.x) * fraction
    const y = head.y - (end.y - start.y) * fraction
    context.globalAlpha *= 0.18 + (1 - index / 7) * 0.72
    context.fillStyle = index === 0 ? "#f1edda" : "#e98b7f"
    context.beginPath()
    context.arc(x, y, index === 0 ? 2.2 : 0.65 + (7 - index) * 0.08, 0, Math.PI * 2)
    context.fill()
    context.globalAlpha /= 0.18 + (1 - index / 7) * 0.72
  }
}

function drawConstellation(
  context: CanvasRenderingContext2D,
  pattern: Point[],
  width: number,
  height: number,
  lifecycle: number,
  patternIndex: number,
  lane: number,
) {
  const points = pattern.map((point) => mapPatternPoint(point, width, height, lane))
  const segments = points.slice(0, -1).map((point, index) => [point, points[index + 1]] as const)
  if (points.length > 3) segments.push([points[points.length - 1], points[0]])

  const lineProgress = clamp(lifecycle / 0.4)
  const profileProgress = clamp((lifecycle - 0.31) / 0.23)
  const popProgress = easeOutCubic(clamp((lifecycle - 0.68) / 0.1))
  const dissolveProgress = clamp((lifecycle - 0.78) / 0.18)
  const alpha = 1 - easeOutCubic(dissolveProgress)
  const scale = 1 + popProgress * 0.3
  const center = points.reduce(
    (total, point) => ({ x: total.x + point.x / points.length, y: total.y + point.y / points.length }),
    { x: 0, y: 0 },
  )

  context.save()
  context.globalAlpha = alpha
  context.filter = dissolveProgress > 0 ? `blur(${(dissolveProgress * 8).toFixed(2)}px)` : "none"
  context.translate(center.x, center.y)
  context.scale(scale, scale)
  context.translate(-center.x, -center.y)
  context.lineWidth = 1.2
  context.strokeStyle = "rgba(241, 237, 218, 0.7)"
  context.lineCap = "round"

  segments.forEach(([start, end], index) => {
    const segmentProgress = clamp(lineProgress * segments.length - index)
    if (segmentProgress <= 0) return

    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(
      start.x + (end.x - start.x) * segmentProgress,
      start.y + (end.y - start.y) * segmentProgress,
    )
    context.stroke()

    if (segmentProgress < 1 && dissolveProgress === 0) {
      drawShootingHead(context, start, end, segmentProgress)
    }
  })

  points.forEach((point, pointIndex) => {
    const starFade = 1 - profileProgress
    for (let starIndex = 0; starIndex < 11; starIndex += 1) {
      const seed = patternIndex * 100 + pointIndex * 17 + starIndex
      const angle = seededNoise(seed) * Math.PI * 2
      const distance = 3 + seededNoise(seed + 1) * 14
      context.globalAlpha = alpha * starFade * (0.34 + seededNoise(seed + 2) * 0.58)
      context.fillStyle = "#f1edda"
      context.beginPath()
      context.arc(
        point.x + Math.cos(angle) * distance,
        point.y + Math.sin(angle) * distance,
        0.65 + seededNoise(seed + 3) * 0.9,
        0,
        Math.PI * 2,
      )
      context.fill()
    }
    context.globalAlpha = alpha
    drawProfile(context, point, profileProgress, width < 560 ? 11 : 16)
  })

  context.restore()
}

export function ConstellationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pointer = { x: -1000, y: -1000, active: false }
    let stars: Star[] = []
    let width = 0
    let height = 0
    let frame = 0
    let startTime = 0
    let entered = reducedMotion
    let lastFrame = 0

    const rebuildStars = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      width = Math.max(Math.round(bounds.width), 1)
      height = Math.max(Math.round(bounds.height), 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      stars = []
      const spacing = width < 560 ? 8 : 9
      let index = 0
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          stars.push({
            x: x + (seededNoise(index) - 0.5) * 2.6,
            y: y + (seededNoise(index + 1) - 0.5) * 2.6,
            alpha: 0.1 + seededNoise(index + 2) * 0.3,
            size: 0.4 + seededNoise(index + 3) * 0.72,
            phase: seededNoise(index + 4) * Math.PI * 2,
            speed: 0.45 + seededNoise(index + 5) * 1.25,
          })
          index += 6
        }
      }
    }

    const draw = (time: number) => {
      if (time - lastFrame < 32 && !reducedMotion) {
        frame = window.requestAnimationFrame(draw)
        return
      }
      lastFrame = time
      context.clearRect(0, 0, width, height)
      context.fillStyle = "#f1edda"

      stars.forEach((star) => {
        let x = star.x
        let y = star.y
        const copyZone = width >= 820
          ? star.x < width * 0.49 && star.y > height * 0.12 && star.y < height * 0.9
          : star.y < height * 0.5
        const pulse = reducedMotion ? 0.72 : 0.55 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.45
        let alpha = star.alpha * (0.58 + pulse * 0.7) * (copyZone ? 0.32 : 1)

        if (pointer.active && !reducedMotion) {
          const deltaX = star.x - pointer.x
          const deltaY = star.y - pointer.y
          const distance = Math.hypot(deltaX, deltaY)
          if (distance < 88 && distance > 0) {
            const force = (1 - distance / 88) * 7
            x += (deltaX / distance) * force
            y += (deltaY / distance) * force
            alpha += (1 - distance / 88) * 0.4
          }
        }

        context.globalAlpha = clamp(alpha)
        const starSize = star.size * (0.86 + pulse * 0.32)
        context.fillRect(x - starSize / 2, y - starSize / 2, starSize, starSize)
      })

      if (entered) {
        if (reducedMotion) {
          drawConstellation(context, constellationPatterns[2], width, height, 0.62, 2, 0)
          drawConstellation(context, constellationPatterns[4], width, height, 0.62, 4, 1)
        } else {
          const elapsed = Math.max(time - startTime, 0)
          const cycleDuration = 3500
          const activeDuration = 3050

          for (let lane = 0; lane < 2; lane += 1) {
            const laneElapsed = Math.max(elapsed - lane * 420, 0)
            const cycleIndex = Math.floor(laneElapsed / cycleDuration)
            const localTime = laneElapsed % cycleDuration
            if (localTime >= activeDuration) continue

            const patternIndex = (cycleIndex * 2 + lane) % constellationPatterns.length
            drawConstellation(
              context,
              constellationPatterns[patternIndex],
              width,
              height,
              localTime / activeDuration,
              patternIndex,
              lane,
            )
          }
        }
      }

      context.globalAlpha = 1
      context.filter = "none"
      if (!reducedMotion) frame = window.requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entered) return
        entered = true
        startTime = performance.now()
      },
      { threshold: 0.18 },
    )

    const resizeObserver = new ResizeObserver(() => {
      rebuildStars()
      if (reducedMotion) draw(performance.now())
    })

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active = true
    }

    const clearPointer = () => {
      pointer.active = false
    }

    rebuildStars()
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    canvas.addEventListener("pointermove", updatePointer)
    canvas.addEventListener("pointerleave", clearPointer)
    if (reducedMotion) draw(performance.now())
    else frame = window.requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener("pointermove", updatePointer)
      canvas.removeEventListener("pointerleave", clearPointer)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="constellation-canvas"
      aria-label="Interactive stars repeatedly forming and releasing teams of two to five people"
      role="img"
    />
  )
}
