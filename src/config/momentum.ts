export type MomentumMetric = {
  id: "builders" | "ideas" | "universities" | "teams"
  value: number
  label: string
}

export type MomentumActivity = {
  id: string
  message: string
  signal: string
}

export type MomentumConfig = {
  isDemo: boolean
  metrics: readonly MomentumMetric[]
  activities: readonly MomentumActivity[]
  skills: readonly string[]
  universitySignals: readonly string[]
}

export const momentumConfig: MomentumConfig = {
  isDemo: true,
  metrics: [
    { id: "builders", value: 248, label: "early builders" },
    { id: "ideas", value: 37, label: "active ideas" },
    { id: "universities", value: 12, label: "universities represented" },
    { id: "teams", value: 68, label: "teams forming" },
  ],
  activities: [
    { id: "designer-jaipur", message: "A designer joined from Jaipur.", signal: "DS" },
    { id: "ai-team", message: "Three AI builders are looking for a fourth teammate.", signal: "AI" },
    { id: "sustainability", message: "A product idea in sustainability is looking for a developer.", signal: "SU" },
    { id: "pixelpilot", message: "Someone reserved the username 'pixelpilot.'", signal: "PP" },
    { id: "new-builders", message: "Five new builders joined today.", signal: "+5" },
  ],
  skills: ["React", "UI/UX", "AI/ML", "Pitching", "Product", "Research", "Video", "Hardware"],
  universitySignals: ["MUJ", "JAIPUR", "12 UNIVERSITIES"],
}
