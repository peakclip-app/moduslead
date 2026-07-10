'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Answer, ScoreResult } from '@/lib/types'
import { scenarios } from '@/lib/scenarios'
import { computeScore, decodeResult } from '@/lib/scoring'
import IntroScreen from '@/components/IntroScreen'
import QuizStep from '@/components/QuizStep'
import ResultsReport from '@/components/ResultsReport'

const LS_ANSWERS_KEY = 'moduslead_answers'
const LS_RESULT_KEY = 'moduslead_result'

type AppView = 'intro' | 'quiz' | 'results'

export default function Home() {
  const [view, setView] = useState<AppView>('intro')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState<ScoreResult | null>(null)

  // ── On mount: check for shared result in URL or in-progress quiz in localStorage
  useEffect(() => {
    // 1. Check URL for a shared result (?r=BASE64)
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('r')
    if (encoded) {
      const decoded = decodeResult(encoded)
      if (decoded) {
        setResult(decoded)
        setView('results')
        return
      }
    }

    // 2. Check localStorage for an in-progress or completed session
    try {
      const savedAnswers = localStorage.getItem(LS_ANSWERS_KEY)
      const savedResult = localStorage.getItem(LS_RESULT_KEY)

      if (savedResult) {
        // Completed quiz in a previous tab or session — show results
        const parsed: ScoreResult = JSON.parse(savedResult)
        setResult(parsed)
        setView('results')
        return
      }

      if (savedAnswers) {
        // In-progress quiz — restore state and jump back in
        const parsed: Answer[] = JSON.parse(savedAnswers)
        if (parsed.length > 0 && parsed.length < scenarios.length) {
          setAnswers(parsed)
          setCurrentIndex(parsed.length)
          setView('quiz')
          return
        }
      }
    } catch {
      // Corrupted localStorage — ignore and start fresh
    }
  }, [])

  // ── Start fresh quiz ─────────────────────────────────────────────────────
  function handleStart() {
    // Clear any previous session
    try {
      localStorage.removeItem(LS_ANSWERS_KEY)
      localStorage.removeItem(LS_RESULT_KEY)
    } catch { /* ignore */ }

    setAnswers([])
    setCurrentIndex(0)
    setResult(null)
    setView('quiz')

    // Clean the URL if we came from a shared link
    const url = new URL(window.location.href)
    if (url.searchParams.has('r')) {
      url.searchParams.delete('r')
      window.history.replaceState({}, '', url.toString())
    }
  }

  // ── Handle each scenario answer ──────────────────────────────────────────
  const handleAnswer = useCallback(
    (style: Answer['chosenStyle']) => {
      const scenario = scenarios[currentIndex]
      const newAnswer: Answer = { scenarioId: scenario.id, chosenStyle: style }
      const newAnswers = [...answers, newAnswer]

      setAnswers(newAnswers)

      // Persist progress
      try {
        localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(newAnswers))
      } catch { /* ignore */ }

      if (currentIndex + 1 >= scenarios.length) {
        // Quiz complete — compute result
        const computed = computeScore(newAnswers, scenarios)
        setResult(computed)

        // Persist result and clean up answers
        try {
          localStorage.setItem(LS_RESULT_KEY, JSON.stringify(computed))
          localStorage.removeItem(LS_ANSWERS_KEY)
        } catch { /* ignore */ }

        setView('results')
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    },
    [answers, currentIndex]
  )

  // ── Retake ───────────────────────────────────────────────────────────────
  function handleRetake() {
    try {
      localStorage.removeItem(LS_ANSWERS_KEY)
      localStorage.removeItem(LS_RESULT_KEY)
    } catch { /* ignore */ }

    const url = new URL(window.location.href)
    url.searchParams.delete('r')
    window.history.replaceState({}, '', url.toString())

    setAnswers([])
    setCurrentIndex(0)
    setResult(null)
    setView('intro')
  }

  // ── Render ───────────────────────────────────────────────────────────────
  if (view === 'intro') {
    return <IntroScreen onStart={handleStart} />
  }

  if (view === 'quiz') {
    const scenario = scenarios[currentIndex]
    return (
      <QuizStep
        scenario={scenario}
        scenarioNumber={currentIndex + 1}
        total={scenarios.length}
        onAnswer={handleAnswer}
      />
    )
  }

  if (view === 'results' && result) {
    return <ResultsReport result={result} onRetake={handleRetake} />
  }

  // Fallback (shouldn't happen)
  return <IntroScreen onStart={handleStart} />
}
