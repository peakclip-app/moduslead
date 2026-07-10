import type { Style, Readiness, Scenario, Answer, ScoreResult } from './types'

const READINESS_TO_STYLE: Record<Readiness, Style> = {
  R1: 'S1',
  R2: 'S2',
  R3: 'S3',
  R4: 'S4',
}

// High directive = S1 or S2; high supportive = S2 or S3
const DIRECTIVE_WEIGHT: Record<Style, number> = { S1: 1, S2: 1, S3: 0, S4: 0 }
const SUPPORTIVE_WEIGHT: Record<Style, number> = { S1: 0, S2: 1, S3: 1, S4: 0 }

// Tiebreak: Coaching first (most diagnostically complete), then Directing, Supporting, Delegating
const TIEBREAK_ORDER: Style[] = ['S2', 'S1', 'S3', 'S4']

export function computeScore(answers: Answer[], scenarios: Scenario[]): ScoreResult {
  const styleCounts: Record<Style, number> = { S1: 0, S2: 0, S3: 0, S4: 0 }
  let directiveSum = 0
  let supportiveSum = 0
  let correctCount = 0

  for (const answer of answers) {
    styleCounts[answer.chosenStyle]++
    directiveSum += DIRECTIVE_WEIGHT[answer.chosenStyle]
    supportiveSum += SUPPORTIVE_WEIGHT[answer.chosenStyle]

    const scenario = scenarios.find((s) => s.id === answer.scenarioId)
    if (scenario && READINESS_TO_STYLE[scenario.readiness] === answer.chosenStyle) {
      correctCount++
    }
  }

  const total = answers.length

  const styleDistribution = Object.fromEntries(
    (['S1', 'S2', 'S3', 'S4'] as Style[]).map((s) => [
      s,
      Math.round((styleCounts[s] / total) * 100),
    ])
  ) as Record<Style, number>

  // Sort by count, stable — ties fall back to TIEBREAK_ORDER
  const sortedStyles = [...TIEBREAK_ORDER].sort(
    (a, b) => styleCounts[b] - styleCounts[a]
  )

  return {
    styleCounts,
    styleDistribution,
    directiveScore: Math.round((directiveSum / total) * 100),
    supportiveScore: Math.round((supportiveSum / total) * 100),
    primaryStyle: sortedStyles[0],
    secondaryStyle: sortedStyles[1],
    leastUsedStyle: sortedStyles[3],
    situationalAccuracy: Math.round((correctCount / total) * 100),
  }
}

// Deterministic shuffle — same scenario always renders options in the same order
// (varies between scenarios, so it's not always the same layout)
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr]
  let h = Array.from(seed).reduce((s, c) => s + c.charCodeAt(0), 0)
  for (let i = copy.length - 1; i > 0; i--) {
    h = ((h * 1664525 + 1013904223) | 0) >>> 0
    const j = h % (i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function encodeResult(result: ScoreResult): string {
  return btoa(JSON.stringify(result))
}

export function decodeResult(encoded: string): ScoreResult | null {
  try {
    return JSON.parse(atob(encoded)) as ScoreResult
  } catch {
    return null
  }
}
