'use client'

import { useEffect, useState } from 'react'
import type { Style, ScoreResult } from '@/lib/types'
import { STYLE_COLORS, STYLE_LABELS, STYLE_PROFILES } from '@/lib/copy'

const DISPLAY_ORDER: Style[] = ['S2', 'S1', 'S3', 'S4']

interface StyleDistributionProps {
  result: ScoreResult
}

export default function StyleDistribution({ result }: StyleDistributionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Sort by count descending so the highest bar is always first
  const sorted = [...DISPLAY_ORDER].sort(
    (a, b) => result.styleCounts[b] - result.styleCounts[a]
  )

  return (
    <div className="space-y-3">
      {sorted.map((style) => {
        const pct = result.styleDistribution[style]
        const isPrimary = result.primaryStyle === style
        const color = STYLE_COLORS[style]

        return (
          <div key={style} className="flex items-center gap-3">
            {/* Style badge */}
            <span
              className="text-xs font-bold shrink-0 w-8"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color,
                letterSpacing: '0.04em',
              }}
            >
              {STYLE_LABELS[style].short}
            </span>

            {/* Bar track */}
            <div
              className="flex-1 h-5 relative overflow-hidden transition-colors"
              style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
            >
              <div
                className="h-full bar-fill"
                style={{
                  width: mounted ? `${pct}%` : '0%',
                  backgroundColor: color,
                  opacity: isPrimary ? 1 : 0.5,
                  transition: mounted ? 'width 0.7s ease-out' : 'none',
                }}
              />
              {/* Inline percentage label */}
              {pct > 8 && (
                <span
                  className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    color: isPrimary ? '#ffffff' : 'var(--ink)',
                    opacity: isPrimary ? 1 : 0.8,
                    fontSize: '10px',
                  }}
                >
                  {pct}%
                </span>
              )}
            </div>

            {/* Style name */}
            <span
              className="text-xs shrink-0 w-20 text-right"
              style={{
                color: isPrimary ? color : 'var(--ink-muted)',
                fontWeight: isPrimary ? 600 : 400,
              }}
            >
              {STYLE_PROFILES[style].name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
