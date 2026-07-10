import { describe, it, expect } from 'vitest'
import { computeScore, seededShuffle, encodeResult, decodeResult } from './scoring'
import type { Scenario, Answer, ScoreResult } from './types'

describe('Leadership Diagnostic Scoring Engine (`computeScore`)', () => {
  const mockScenarios: Scenario[] = [
    { id: 's1', prompt: 'Task 1', readiness: 'R1', options: [] },
    { id: 's2', prompt: 'Task 2', readiness: 'R2', options: [] },
    { id: 's3', prompt: 'Task 3', readiness: 'R3', options: [] },
    { id: 's4', prompt: 'Task 4', readiness: 'R4', options: [] },
  ]

  it('calculates 100% situational accuracy when all answers match textbook readiness', () => {
    const answers: Answer[] = [
      { scenarioId: 's1', chosenStyle: 'S1' },
      { scenarioId: 's2', chosenStyle: 'S2' },
      { scenarioId: 's3', chosenStyle: 'S3' },
      { scenarioId: 's4', chosenStyle: 'S4' },
    ]

    const result = computeScore(answers, mockScenarios)
    expect(result.situationalAccuracy).toBe(100)
    expect(result.styleCounts).toEqual({ S1: 1, S2: 1, S3: 1, S4: 1 })
    expect(result.styleDistribution).toEqual({ S1: 25, S2: 25, S3: 25, S4: 25 })
  })

  it('calculates directive and supportive scores correctly', () => {
    // 2 answers S1 (directive=1, supportive=0) -> directiveSum=2, supportiveSum=0
    // 2 answers S2 (directive=1, supportive=1) -> directiveSum=2, supportiveSum=2
    // Total directive=4/4 (100%), supportive=2/4 (50%)
    const answers: Answer[] = [
      { scenarioId: 's1', chosenStyle: 'S1' },
      { scenarioId: 's2', chosenStyle: 'S1' },
      { scenarioId: 's3', chosenStyle: 'S2' },
      { scenarioId: 's4', chosenStyle: 'S2' },
    ]

    const result = computeScore(answers, mockScenarios)
    expect(result.directiveScore).toBe(100)
    expect(result.supportiveScore).toBe(50)
  })

  it('resolves ties deterministically using TIEBREAK_ORDER (Coaching S2 first)', () => {
    const answers: Answer[] = [
      { scenarioId: 's1', chosenStyle: 'S1' },
      { scenarioId: 's2', chosenStyle: 'S2' },
      { scenarioId: 's3', chosenStyle: 'S3' },
      { scenarioId: 's4', chosenStyle: 'S4' },
    ]

    const result = computeScore(answers, mockScenarios)
    // S2 is first in tiebreak order when counts are equal (1 each)
    expect(result.primaryStyle).toBe('S2')
    expect(result.leastUsedStyle).toBe('S4')
  })
})

describe('Deterministic Question Shuffling (`seededShuffle`)', () => {
  it('returns the exact same order for the same seed across invocations', () => {
    const options = ['Option S1', 'Option S2', 'Option S3', 'Option S4']
    const shuffleA = seededShuffle(options, 'scenario-alpha')
    const shuffleB = seededShuffle(options, 'scenario-alpha')

    expect(shuffleA).toEqual(shuffleB)
  })

  it('produces different option distributions for different scenario seeds', () => {
    const options = ['Option S1', 'Option S2', 'Option S3', 'Option S4']
    const shuffleA = seededShuffle(options, 'seed-1')
    const shuffleB = seededShuffle(options, 'seed-2')

    expect(shuffleA).not.toEqual(shuffleB)
  })
})

describe('Stateless URL Payload Serialization (`encodeResult` & `decodeResult`)', () => {
  it('encodes and cleanly decodes a ScoreResult round-trip', () => {
    const sampleResult: ScoreResult = {
      styleCounts: { S1: 4, S2: 8, S3: 2, S4: 2 },
      styleDistribution: { S1: 25, S2: 50, S3: 12.5, S4: 12.5 },
      directiveScore: 75,
      supportiveScore: 62.5,
      primaryStyle: 'S2',
      secondaryStyle: 'S1',
      leastUsedStyle: 'S4',
      situationalAccuracy: 81.25,
    }

    const encoded = encodeResult(sampleResult)
    expect(typeof encoded).toBe('string')

    const decoded = decodeResult(encoded)
    expect(decoded).toEqual(sampleResult)
  })

  it('returns null when decoding corrupted base64 input', () => {
    const decoded = decodeResult('not-valid-base-64-@#%')
    expect(decoded).toBeNull()
  })
})
