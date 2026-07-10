export type Style = 'S1' | 'S2' | 'S3' | 'S4'
export type Readiness = 'R1' | 'R2' | 'R3' | 'R4'

export interface ScenarioOption {
  style: Style
  text: string
}

export interface Scenario {
  id: string
  prompt: string
  readiness: Readiness
  options: ScenarioOption[]
}

export interface Answer {
  scenarioId: string
  chosenStyle: Style
}

export interface ScoreResult {
  styleCounts: Record<Style, number>
  styleDistribution: Record<Style, number>
  directiveScore: number
  supportiveScore: number
  primaryStyle: Style
  secondaryStyle: Style
  leastUsedStyle: Style
  situationalAccuracy: number
}
