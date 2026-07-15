import { useEffect, useRef } from "react"

const vertexShader = [
  "precision highp float;",
  "uniform float uTime;",
  "uniform float uPointer;",
  "varying float vElevation;",
  "varying float vBand;",
  "varying vec2 vUv;",
  "",
  "float hash(vec2 p) {",
  "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);",
  "}",
  "",
  "float noise(vec2 p) {",
  "  vec2 i = floor(p);",
  "  vec2 f = fract(p);",
  "  f = f * f * (3.0 - 2.0 * f);",
  "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),",
  "             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);",
  "}",
  "",
  "void main() {",
  "  vec3 p = position;",
  "  float drift = uTime * 0.045;",
  "  float broad = sin(p.x * 0.38 + p.y * 0.16 + drift) * 0.72;",
  "  float crossWave = sin(p.y * 0.54 - p.x * 0.12 - drift * 0.7) * 0.42;",
  "  float detail = (noise(p.xy * 0.23 + vec2(drift * 0.08, 0.0)) - 0.5) * 1.9;",
  "  float pull = exp(-pow((p.x - uPointer * 3.0) * 0.18, 2.0)) * 0.32;",
  "  float elevation = broad + crossWave + detail + pull;",
  "  p.z += elevation * 1.45;",
  "  p.x += sin(p.y * 0.21 + drift * 0.3) * 0.58;",
  "  vElevation = elevation;",
  "  vBand = p.y;",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);",
  "}",
].join("\n")

const fragmentShader = [
  "precision highp float;",
  "uniform float uTime;",
  "varying float vElevation;",
  "varying float vBand;",
  "varying vec2 vUv;",
  "",
  "float hash(vec2 p) {",
  "  return fract(sin(dot(p, vec2(41.7, 289.1))) * 43758.5453);",
  "}",
  "",
  "void main() {",
  "  vec3 ink = vec3(0.025, 0.027, 0.043);",
  "  vec3 paper = vec3(0.92, 0.90, 0.82);",
  "  vec3 coral = vec3(1.0, 0.46, 0.41);",
  "  float bands = sin(vBand * 1.28 + vElevation * 4.4);",
  "  float field = smoothstep(-0.15, 0.22, bands);",
  "  float fineBand = smoothstep(0.87, 0.99, abs(sin(vBand * 3.1 + vElevation * 7.0)));",
  "  vec3 color = mix(ink, paper, field);",
  "  color = mix(color, ink, fineBand * 0.23);",
  "  float ridge = 1.0 - smoothstep(0.035, 0.085, abs(vElevation - 0.92));",
  "  color = mix(color, coral, ridge * 0.42);",
  "  float grain = hash(gl_FragCoord.xy + uTime) - 0.5;",
  "  color += grain * 0.045;",
  "  float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(0.0, 0.08, 1.0 - vUv.x);",
  "  edge *= smoothstep(0.0, 0.12, vUv.y) * smoothstep(0.0, 0.16, 1.0 - vUv.y);",
  "  gl_FragColor = vec4(color, edge * 0.98);",
  "}",
].join("\n")

export function TerrainScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let teardown = () => {}
    const timer = window.setTimeout(async () => {
      try {
        const THREE = await import("three")
        if (disposed || !container) return

        const isMobile = window.innerWidth < 760
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: "high-performance",
        })
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.5))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.domElement.className = "terrain-canvas"
        container.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
        camera.position.set(0, 3.7, 14.6)
        camera.lookAt(0, -1.05, 0)

        const uniforms = {
          uTime: { value: 0 },
          uPointer: { value: 0 },
        }

        const terrainGeometry = new THREE.PlaneGeometry(
          isMobile ? 24 : 30,
          15,
          isMobile ? 72 : 120,
          isMobile ? 46 : 76,
        )
        const terrainMaterial = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: true,
        })
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
        terrain.rotation.x = -1.18
        terrain.rotation.z = -0.035
        terrain.position.set(isMobile ? 1.2 : 3.0, -4.35, -1.1)
        scene.add(terrain)

        const random = (() => {
          let seed = 1729
          return () => {
            seed = (seed * 16807) % 2147483647
            return (seed - 1) / 2147483646
          }
        })()
        const pointCount = isMobile ? 42 : 76
        const positions = new Float32Array(pointCount * 3)
        const pointColors = new Float32Array(pointCount * 3)
        const paperColor = new THREE.Color("#f2ebcc")
        const coralColor = new THREE.Color("#ff7568")
        const violetColor = new THREE.Color("#8c79ff")

        for (let index = 0; index < pointCount; index += 1) {
          positions[index * 3] = (random() - 0.5) * 22
          positions[index * 3 + 1] = (random() - 0.28) * 11
          positions[index * 3 + 2] = (random() - 0.5) * 8
          const color = random() > 0.83
            ? (random() > 0.5 ? coralColor : violetColor)
            : paperColor
          pointColors[index * 3] = color.r
          pointColors[index * 3 + 1] = color.g
          pointColors[index * 3 + 2] = color.b
        }

        const pointsGeometry = new THREE.BufferGeometry()
        pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        pointsGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3))
        const pointsMaterial = new THREE.PointsMaterial({
          size: isMobile ? 0.045 : 0.055,
          vertexColors: true,
          transparent: true,
          opacity: 0.72,
          sizeAttenuation: true,
        })
        const points = new THREE.Points(pointsGeometry, pointsMaterial)
        points.position.z = -1.8
        scene.add(points)

        const pointer = { current: 0, target: 0, y: 0 }
        let visible = true
        let animationId = 0
        let lastTime = performance.now()

        const resize = () => {
          const bounds = container.getBoundingClientRect()
          if (!bounds.width || !bounds.height) return
          renderer.setSize(bounds.width, bounds.height, false)
          camera.aspect = bounds.width / bounds.height
          camera.updateProjectionMatrix()
        }

        const handlePointer = (event: PointerEvent) => {
          pointer.target = (event.clientX / window.innerWidth) * 2 - 1
          pointer.y = (event.clientY / window.innerHeight) * 2 - 1
        }

        const renderForCheck = () => {
          renderer.render(scene, camera)
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting
          },
          { rootMargin: "120px" },
        )
        observer.observe(container)

        const frame = (time: number) => {
          animationId = window.requestAnimationFrame(frame)
          if (!visible) return
          const delta = Math.min((time - lastTime) / 1000, 0.05)
          lastTime = time
          pointer.current += (pointer.target - pointer.current) * 0.035
          uniforms.uTime.value += delta
          uniforms.uPointer.value = pointer.current
          camera.position.x += (pointer.current * 0.24 - camera.position.x) * 0.025
          camera.position.y += (3.7 - pointer.y * 0.11 - camera.position.y) * 0.025
          points.rotation.z = Math.sin(time * 0.00006) * 0.018
          renderer.render(scene, camera)
        }

        resize()
        window.addEventListener("resize", resize)
        window.addEventListener("pointermove", handlePointer, { passive: true })
        renderer.domElement.addEventListener("pairup:render-check", renderForCheck)
        animationId = window.requestAnimationFrame(frame)
        container.classList.add("terrain-ready")

        teardown = () => {
          window.cancelAnimationFrame(animationId)
          window.removeEventListener("resize", resize)
          window.removeEventListener("pointermove", handlePointer)
          renderer.domElement.removeEventListener("pairup:render-check", renderForCheck)
          observer.disconnect()
          terrainGeometry.dispose()
          terrainMaterial.dispose()
          pointsGeometry.dispose()
          pointsMaterial.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
      } catch {
        container.classList.add("terrain-fallback-only")
      }
    }, 80)

    return () => {
      disposed = true
      window.clearTimeout(timer)
      teardown()
    }
  }, [])

  return (
    <div ref={containerRef} className="terrain-scene" aria-hidden="true">
      <svg className="terrain-fallback" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M-30 740C180 610 318 782 512 666C710 548 846 724 1045 612C1202 524 1348 575 1490 510V950H-30Z" />
        <path d="M-40 820C160 696 348 872 564 747C770 628 910 820 1114 694C1274 596 1396 642 1490 592V950H-40Z" />
        <path d="M-30 870C245 752 370 925 654 814C902 718 1094 876 1490 710V950H-30Z" />
      </svg>
    </div>
  )
}
