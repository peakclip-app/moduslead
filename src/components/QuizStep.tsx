'use client'

import { useMemo, useState, useEffect } from 'react'
import type { Style, Scenario } from '@/lib/types'
import { STYLE_COLORS } from '@/lib/copy'
import { seededShuffle } from '@/lib/scoring'
import ThemeToggle from './ThemeToggle'

// ── Ruler-style progress indicator ──────────────────────────────────────────
function RulerProgress({ current, total }: { current: number; total: number }) {
  const MAJOR_EVERY = 4
  const pct = (current / total) * 100

  return (
    <div className="w-full mb-6">
      {/* Tick row */}
      <div className="relative w-full" style={{ height: '20px' }}>
        {/* Base line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: '10px',
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Progress fill */}
        <div
          className="absolute left-0"
          style={{
            top: '10px',
            height: '1px',
            width: `${pct}%`,
            backgroundColor: 'var(--cta)',
            transition: 'width 0.3s ease-out',
          }}
        />

        {/* Ticks */}
        {Array.from({ length: total + 1 }).map((_, i) => {
          const isMajor = i % MAJOR_EVERY === 0
          const isCompleted = i <= current
          const tickH = isMajor ? 12 : 6
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i / total) * 100}%`,
                top: `${10 - tickH / 2}px`,
                width: '1px',
                height: `${tickH}px`,
                backgroundColor: isCompleted ? 'var(--cta)' : 'var(--border)',
                transform: 'translateX(-0.5px)',
              }}
            />
          )
        })}

        {/* Moving marker (diamond) */}
        <div
          className="absolute marker-slide"
          style={{
            left: `${pct}%`,
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--cta)',
            transition: 'left 0.3s ease-out',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1">
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
        >
          {current} / {total}
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
        >
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  )
}

// ── Option card ──────────────────────────────────────────────────────────────
function OptionCard({
  text,
  style,
  selected,
  onSelect,
}: {
  text: string
  style: Style
  selected: boolean
  onSelect: () => void
}) {
  const color = STYLE_COLORS[style]

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 sm:p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 rounded-none ${
        selected ? 'option-select' : ''
      }`}
      style={{
        backgroundColor: selected ? `${color}18` : 'var(--bg-card)',
        border: selected ? `1.5px solid ${color}` : '1.5px solid var(--border)',
        color: 'var(--ink)',
      }}
    >
      <div className="flex items-start gap-3.5">
        {/* Selection indicator */}
        <div
          className="shrink-0 mt-0.5"
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: selected ? `5px solid ${color}` : '1.5px solid var(--border-strong)',
            backgroundColor: 'var(--bg)',
            transition: 'border 0.12s ease',
          }}
        />
        <span className="text-sm sm:text-base leading-relaxed">{text}</span>
      </div>
    </button>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
interface QuizStepProps {
  scenario: Scenario
  scenarioNumber: number
  total: number
  onAnswer: (style: Style) => void
}

export default function QuizStep({
  scenario,
  scenarioNumber,
  total,
  onAnswer,
}: QuizStepProps) {
  const [selected, setSelected] = useState<Style | null>(null)
  const [canAdvance, setCanAdvance] = useState(false)

  // Reset state when scenario changes
  useEffect(() => {
    setSelected(null)
    setCanAdvance(false)
  }, [scenario.id])

  // Shuffle options deterministically — same order for same scenario
  const shuffledOptions = useMemo(
    () => seededShuffle(scenario.options, scenario.id),
    [scenario.id, scenario.options]
  )

  function handleSelect(style: Style) {
    setSelected(style)
    // Brief delay before enabling Continue — feels more deliberate
    setTimeout(() => setCanAdvance(true), 200)
  }

  function handleContinue() {
    if (selected) onAnswer(selected)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg text-ink transition-colors">
      {/* Header */}
      <header
        className="px-4 sm:px-6 py-4 flex items-center justify-between transition-colors"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="font-bold tracking-tight text-sm sm:text-base"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink)' }}
        >
          ModusLead
        </span>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
          >
            Scenario {scenarioNumber} of {total}
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-xl">
          {/* Progress ruler */}
          <RulerProgress current={scenarioNumber - 1} total={total} />

          {/* Scenario prompt */}
          <div
            className="mb-6 p-4 sm:p-5 transition-colors"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2 sm:mb-3 font-bold"
              style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
            >
              The situation
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--ink)' }}>
              {scenario.prompt}
            </p>
          </div>

          {/* Options label */}
          <p
            className="text-xs uppercase tracking-widest mb-3 font-bold"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
          >
            Your response
          </p>

          {/* Option cards */}
          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => (
              <OptionCard
                key={option.style}
                text={option.text}
                style={option.style}
                selected={selected === option.style}
                onSelect={() => handleSelect(option.style)}
              />
            ))}
          </div>

          {/* Continue button — appears after selection */}
          <div
            style={{
              opacity: canAdvance ? 1 : 0,
              transform: canAdvance ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: canAdvance ? 'auto' : 'none',
            }}
          >
            <button
              onClick={handleContinue}
              className="w-full py-4 font-semibold text-white text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all shadow-sm rounded-none hover:opacity-95 active:scale-[0.99]"
              style={{ backgroundColor: 'var(--cta)' }}
            >
              {scenarioNumber === total ? 'See your results →' : 'Continue →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
