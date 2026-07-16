export type MomentumMetric = {
  id: "builders"
  value: number
  suffix: string
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
}

export const momentumConfig: MomentumConfig = {
  isDemo: false,
  metrics: [
    { id: "builders", value: 100, suffix: "+", label: "early builders on the list" },
  ],
  activities: [
    { id: "priority-queue", message: "Early members enter the priority matching queue.", signal: "01" },
    { id: "founding-badge", message: "The first 250 members choose an exclusive Founding Member badge and receive support + perks.", signal: "02" },
    { id: "university-circle", message: "Get to know cool people at your university.", signal: "03" },
    { id: "startup-circle", message: "Find your dream startup circle.", signal: "04" },
    { id: "built-by-us", message: "Built by us. For us.", signal: "05" },
  ],
  skills: ["React", "UI/UX", "AI/ML", "Pitching", "Product", "Research", "Video", "Hardware"],
}
