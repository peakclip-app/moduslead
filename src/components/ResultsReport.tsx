'use client'

import { useState, useEffect } from 'react'
import type { ScoreResult } from '@/lib/types'
import {
  STYLE_COLORS,
  STYLE_LABELS,
  STYLE_PROFILES,
  accuracyCopy,
  developmentCopy,
} from '@/lib/copy'
import QuadrantPlot from './QuadrantPlot'
import StyleDistribution from './StyleDistribution'
import ShareCard from './ShareCard'

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  label,
  children,
  delay = 0,
}: {
  label: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className="fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div
        className="text-xs uppercase tracking-widest mb-3"
        style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <hr style={{ borderColor: 'rgba(154,164,174,0.25)', margin: '0' }} />
}

// ── Accuracy band ────────────────────────────────────────────────────────────
function AccuracyBand({ score, label }: { score: number; label: string }) {
  const color = score >= 75 ? '#3d8b83' : score >= 50 ? '#c98a3b' : '#8b5a7c'

  return (
    <div
      className="flex items-center justify-between p-4"
      style={{ border: `1px solid ${color}30`, backgroundColor: `${color}08` }}
    >
      <div>
        <div
          className="text-xs uppercase tracking-widest mb-0.5"
          style={{ fontFamily: 'var(--font-mono, monospace)', color }}
        >
          {label}
        </div>
        <div className="text-xs" style={{ color: 'rgba(22,26,31,0.55)' }}>
          Situational accuracy
        </div>
      </div>
      <div
        className="text-3xl font-bold"
        style={{ fontFamily: 'var(--font-mono, monospace)', color }}
      >
        {score}%
      </div>
    </div>
  )
}

// ── Narrative block ──────────────────────────────────────────────────────────
function NarrativeBlock({
  title,
  body,
  accentColor,
}: {
  title: string
  body: string
  accentColor: string
}) {
  return (
    <div className="p-4" style={{ border: '1px solid rgba(154,164,174,0.25)' }}>
      <div
        className="text-xs font-bold mb-2 uppercase tracking-wide"
        style={{ color: accentColor, fontFamily: 'var(--font-mono, monospace)' }}
      >
        {title}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(22,26,31,0.8)' }}>
        {body}
      </p>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
interface ResultsReportProps {
  result: ScoreResult
  onRetake: () => void
}

export default function ResultsReport({ result, onRetake }: ResultsReportProps) {
  const [analyticsData, setAnalyticsData] = useState<{
    totalAssessments: number
    benchmarkPercentile: number
  } | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primaryStyle: result.primaryStyle,
        situationalAccuracy: result.situationalAccuracy,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (mounted && json.success && json.data) {
          setAnalyticsData({
            totalAssessments: json.data.totalAssessments,
            benchmarkPercentile: json.data.benchmarkPercentile,
          })
        }
      })
      .catch((err) => console.error('Failed to report completion analytics:', err))

    return () => {
      mounted = false
    }
  }, [result.primaryStyle, result.situationalAccuracy])

  const primaryColor = STYLE_COLORS[result.primaryStyle]
  const leastColor = STYLE_COLORS[result.leastUsedStyle]
  const primaryProfile = STYLE_PROFILES[result.primaryStyle]
  const leastProfile = STYLE_PROFILES[result.leastUsedStyle]
  const accuracy = accuracyCopy(result)
  const development = developmentCopy(result)

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
          ModusLead
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
        >
          Your results
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl space-y-8">

          {/* ── Hero: primary style ──────────────────────── */}
          <Section label="Your primary style" delay={0}>
            <div
              className="p-5"
              style={{
                borderLeft: `3px solid ${primaryColor}`,
                backgroundColor: `${primaryColor}08`,
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    color: primaryColor,
                  }}
                >
                  {STYLE_LABELS[result.primaryStyle].short}
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: '#161a1f' }}
                >
                  {primaryProfile.name}
                </span>
              </div>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: primaryColor }}
              >
                {primaryProfile.tagline}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(22,26,31,0.75)' }}>
                {primaryProfile.description}
              </p>
            </div>
          </Section>

          <Divider />

          {/* ── Quadrant plot (signature element) ───────── */}
          <Section label="Where you land" delay={100}>
            <QuadrantPlot result={result} />

            {/* Directive + Supportive score badges below plot */}
            <div className="flex gap-3 mt-4">
              {[
                { label: 'Directive', value: result.directiveScore },
                { label: 'Supportive', value: result.supportiveScore },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex-1 p-3 flex items-center justify-between"
                  style={{ border: '1px solid rgba(154,164,174,0.3)' }}
                >
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ fontFamily: 'var(--font-mono, monospace)', color: '#161a1f' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ── Situational accuracy ──────────────────────── */}
          <Section label="Situational accuracy" delay={150}>
            <AccuracyBand
              score={result.situationalAccuracy}
              label={accuracy.label}
            />
            <div className="mt-3">
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: '#161a1f' }}
              >
                {accuracy.headline}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(22,26,31,0.72)' }}>
                {accuracy.body}
              </p>
            </div>

            {/* ── People Analytics / Global HR Benchmark ──────── */}
            {analyticsData && (
              <div
                className="mt-5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  border: `1px solid ${primaryColor}40`,
                  backgroundColor: `${primaryColor}08`,
                }}
              >
                <div>
                  <div
                    className="text-xs uppercase tracking-widest mb-1 font-bold"
                    style={{ fontFamily: 'var(--font-mono, monospace)', color: '#161a1f' }}
                  >
                    Global HR People Analytics Benchmark
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(22,26,31,0.75)' }}>
                    Your situational accuracy of <strong style={{ color: primaryColor }}>{result.situationalAccuracy}%</strong> puts you higher than <strong style={{ color: primaryColor }}>{analyticsData.benchmarkPercentile}%</strong> of the{' '}
                    <strong>{analyticsData.totalAssessments.toLocaleString()}</strong> leaders assessed across our situational database.
                  </p>
                </div>
                <div
                  className="px-3 py-1.5 text-xs font-bold whitespace-nowrap self-start sm:self-center shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    color: primaryColor,
                    border: `1px solid ${primaryColor}60`,
                    backgroundColor: `#f1f3f2`,
                  }}
                >
                  Top {Math.max(1, 100 - analyticsData.benchmarkPercentile)}% Percentile
                </div>
              </div>
            )}
          </Section>

          <Divider />

          {/* ── Style distribution ────────────────────────── */}
          <Section label="Style distribution" delay={200}>
            <StyleDistribution result={result} />
          </Section>

          <Divider />

          {/* ── Narrative sections ────────────────────────── */}
          <Section label="Your leadership profile" delay={250}>
            <div className="space-y-3">
              <NarrativeBlock
                title="Strength"
                body={primaryProfile.strength}
                accentColor={primaryColor}
              />
              <NarrativeBlock
                title={`Blind spot · ${STYLE_LABELS[result.leastUsedStyle].short} ${leastProfile.name}`}
                body={leastProfile.blindSpot}
                accentColor={leastColor}
              />
              <NarrativeBlock
                title="Development focus"
                body={development}
                accentColor="#9aa4ae"
              />
            </div>
          </Section>

          <Divider />

          {/* ── Share card ────────────────────────────────── */}
          <Section label="Share your results" delay={300}>
            <ShareCard result={result} onRetake={onRetake} />
          </Section>

          {/* ── Footer note ───────────────────────────────── */}
          <p
            className="text-xs text-center pb-4"
            style={{ color: '#9aa4ae', fontFamily: 'var(--font-mono, monospace)' }}
          >
            Based on a simplified interpretation of Hersey & Blanchard&rsquo;s
            Situational Leadership Theory. Not the licensed SLII® instrument.
          </p>
        </div>
      </main>
    </div>
  )
}
