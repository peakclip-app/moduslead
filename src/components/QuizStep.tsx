'use client'

import { useMemo, useState, useEffect } from 'react'
import type { Style, Scenario } from '@/lib/types'
import { STYLE_COLORS } from '@/lib/copy'
import { seededShuffle } from '@/lib/scoring'

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
            backgroundColor: 'rgba(154,164,174,0.35)',
          }}
        />

        {/* Progress fill */}
        <div
          className="absolute left-0"
          style={{
            top: '10px',
            height: '1px',
            width: `${pct}%`,
            backgroundColor: '#3d8b83',
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
                backgroundColor: isCompleted ? '#3d8b83' : 'rgba(154,164,174,0.5)',
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
            backgroundColor: '#3d8b83',
            transition: 'left 0.3s ease-out',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1">
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
        >
          {current} / {total}
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
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
      className={`w-full text-left p-4 transition-all duration-150 focus:outline-none focus-visible:ring-2 ${
        selected ? 'option-select' : ''
      }`}
      style={{
        backgroundColor: selected ? `${color}12` : '#f1f3f2',
        border: selected ? `1.5px solid ${color}` : '1.5px solid rgba(154,164,174,0.3)',
        color: '#161a1f',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Selection indicator */}
        <div
          className="shrink-0 mt-0.5"
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: selected ? `4px solid ${color}` : '1.5px solid rgba(154,164,174,0.5)',
            backgroundColor: '#f1f3f2',
            transition: 'border 0.12s ease',
          }}
        />
        <span className="text-sm leading-relaxed">{text}</span>
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1f3f2' }}>
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(154,164,174,0.3)' }}
      >
        <span
          className="font-bold tracking-tight text-sm"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#161a1f' }}
        >
          LeadLens
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
        >
          Scenario {scenarioNumber} of {total}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Progress ruler */}
          <RulerProgress current={scenarioNumber - 1} total={total} />

          {/* Scenario prompt */}
          <div
            className="mb-6 p-5"
            style={{
              border: '1px solid rgba(154,164,174,0.3)',
              backgroundColor: 'rgba(22,26,31,0.03)',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
            >
              The situation
            </p>
            <p className="text-base leading-relaxed" style={{ color: '#161a1f' }}>
              {scenario.prompt}
            </p>
          </div>

          {/* Options label */}
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
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
              className="w-full py-4 font-semibold text-white text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
              style={{ backgroundColor: '#3d8b83' }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#346e68')
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3d8b83')
              }
            >
              {scenarioNumber === total ? 'See your results →' : 'Continue →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
