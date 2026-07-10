'use client'

// ── Mini decorative quadrant for the hero ───────────────────────────────────
function MiniQuadrant() {
  const colors = { S3: '#c98a3b', S2: '#3d8b83', S4: '#8b5a7c', S1: '#4a6fa5' }
  const labels = { S3: 'S3', S2: 'S2', S4: 'S4', S1: 'S1' }

  return (
    <svg
      viewBox="0 0 120 120"
      width="88"
      height="88"
      aria-hidden="true"
    >
      {/* Border */}
      <rect x="4" y="4" width="112" height="112" fill="none" stroke="#9aa4ae" strokeWidth="1" />

      {/* Dividers */}
      <line x1="60" y1="4" x2="60" y2="116" stroke="#9aa4ae" strokeWidth="0.75" strokeDasharray="2 3" />
      <line x1="4" y1="60" x2="116" y2="60" stroke="#9aa4ae" strokeWidth="0.75" strokeDasharray="2 3" />

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
          opacity="0.75"
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
    <div className="border p-4" style={{ borderColor: 'rgba(154,164,174,0.4)' }}>
      <div
        className="text-xs uppercase tracking-widest mb-1"
        style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
      >
        {label}
      </div>
      <div className="text-sm" style={{ color: 'rgba(22,26,31,0.78)' }}>
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
          className="text-xs hidden sm:block"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
        >
          Situational Leadership Diagnostic
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Decorative quadrant + headline */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="mb-6">
              <MiniQuadrant />
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
              style={{ color: '#161a1f' }}
            >
              How do you actually lead?
            </h1>

            <p
              className="text-lg mb-2 max-w-md"
              style={{ color: 'rgba(22,26,31,0.68)' }}
            >
              16 real management scenarios. Your honest responses. A personalized
              map of your leadership style — strengths, blind spots, and where to
              grow next.
            </p>

            <p
              className="text-sm mb-10"
              style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
            >
              ~8 min · 16 scenarios · Hersey & Blanchard model
            </p>

            <button
              onClick={onStart}
              className="px-8 py-4 text-base font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: '#3d8b83',
                letterSpacing: '0.01em',
              }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#346e68')
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3d8b83')
              }
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
      <footer className="px-6 py-4 text-center">
        <p
          className="text-xs"
          style={{ color: '#9aa4ae', fontFamily: 'var(--font-mono, monospace)' }}
        >
          A simplified, non-licensed interpretation of Hersey & Blanchard&rsquo;s Situational
          Leadership Theory
        </p>
      </footer>
    </div>
  )
}
