'use client'

import ThemeToggle from './ThemeToggle'

// ── Mini decorative quadrant for the hero ───────────────────────────────────
function MiniQuadrant() {
  const colors = { S3: 'var(--s3)', S2: 'var(--s2)', S4: 'var(--s4)', S1: 'var(--s1)' }
  const labels = { S3: 'S3', S2: 'S2', S4: 'S4', S1: 'S1' }

  return (
    <svg
      viewBox="0 0 120 120"
      width="88"
      height="88"
      aria-hidden="true"
    >
      {/* Border */}
      <rect x="4" y="4" width="112" height="112" fill="none" stroke="var(--ink-muted)" strokeWidth="1" />

      {/* Dividers */}
      <line x1="60" y1="4" x2="60" y2="116" stroke="var(--ink-muted)" strokeWidth="0.75" strokeDasharray="2 3" />
      <line x1="4" y1="60" x2="116" y2="60" stroke="var(--ink-muted)" strokeWidth="0.75" strokeDasharray="2 3" />

      {/* Quadrant labels */}
      {([
        { style: 'S3', cx: 30, cy: 30 },
        { style: 'S2', cx: 90, cy: 30 },
        { style: 'S4', cx: 30, cy: 90 },
        { style: 'S1', cx: 90, cy: 90 },
      ] as const).map(({ style, cx, cy }) => (
        <text
          key={style}
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={colors[style]}
          fontFamily="var(--font-mono, monospace)"
          opacity="0.85"
        >
          {labels[style]}
        </text>
      ))}
    </svg>
  )
}

// ── Explainer card ──────────────────────────────────────────────────────────
function ExplainerCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="border p-4 transition-colors" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
      <div
        className="text-xs uppercase tracking-widest mb-1 font-bold"
        style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
      >
        {label}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
        {text}
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
interface IntroScreenProps {
  onStart: () => void
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg text-ink transition-colors">
      {/* Header */}
      <header
        className="px-4 sm:px-6 py-4 flex items-center justify-between transition-colors"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-bold tracking-tight text-sm sm:text-base"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink)' }}
          >
            ModusLead
          </span>
          <span
            className="text-xs hidden sm:inline-block"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
          >
            Situational Leadership Diagnostic
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {/* Decorative quadrant + headline */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
            <div className="mb-5 sm:mb-6">
              <MiniQuadrant />
            </div>

            <h1
              className="text-3xl sm:text-5xl font-bold leading-tight mb-4"
              style={{ color: 'var(--ink)' }}
            >
              How do you actually lead?
            </h1>

            <p
              className="text-base sm:text-lg mb-2 max-w-md leading-relaxed"
              style={{ color: 'var(--ink-secondary)' }}
            >
              16 real management scenarios. Your honest responses. A personalized
              map of your leadership style — strengths, blind spots, and where to
              grow next.
            </p>

            <p
              className="text-xs sm:text-sm mb-8 sm:mb-10 font-medium"
              style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink-muted)' }}
            >
              ~8 min · 16 scenarios · Hersey & Blanchard model
            </p>

            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-none shadow-sm hover:opacity-95 active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--cta)',
                letterSpacing: '0.01em',
              }}
            >
              Start assessment →
            </button>
          </div>

          {/* What you'll learn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ExplainerCard
              label="Primary style"
              text="Your default approach when managing others across different situations"
            />
            <ExplainerCard
              label="Blind spot"
              text="The leadership mode you almost never reach for — and when it costs you"
            />
            <ExplainerCard
              label="Accuracy"
              text="How well you match your approach to where each person actually is"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-4 text-center border-t border-border/40">
        <p
          className="text-xs"
          style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono, monospace)' }}
        >
          A simplified, non-licensed interpretation of Hersey & Blanchard&rsquo;s Situational
          Leadership Theory
        </p>
      </footer>
    </div>
  )
}
