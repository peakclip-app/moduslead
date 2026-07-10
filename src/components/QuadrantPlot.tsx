'use client'

import { useEffect, useState } from 'react'
import type { Style, ScoreResult } from '@/lib/types'
import { STYLE_COLORS, STYLE_LABELS } from '@/lib/copy'

// SVG canvas
const W = 480
const H = 480
const PAD = { left: 62, right: 28, top: 36, bottom: 58 }
const PW = W - PAD.left - PAD.right // plot width
const PH = H - PAD.top - PAD.bottom // plot height
const X0 = PAD.left
const Y0 = PAD.top
const X1 = X0 + PW
const Y1 = Y0 + PH
const CX = X0 + PW / 2
const CY = Y0 + PH / 2

// Quadrant label centers
const QUADRANT_CENTERS: Array<{ style: Style; x: number; y: number }> = [
  { style: 'S3', x: X0 + PW * 0.25, y: Y0 + PH * 0.25 },
  { style: 'S2', x: X0 + PW * 0.75, y: Y0 + PH * 0.25 },
  { style: 'S4', x: X0 + PW * 0.25, y: Y0 + PH * 0.75 },
  { style: 'S1', x: X0 + PW * 0.75, y: Y0 + PH * 0.75 },
]

interface QuadrantPlotProps {
  result: ScoreResult
}

export default function QuadrantPlot({ result }: QuadrantPlotProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    // Small delay so the page renders before the dot settles in
    const t = setTimeout(() => setAnimated(true), 350)
    return () => clearTimeout(t)
  }, [])

  // Convert 0-100 scores to SVG coordinates
  // X: directive score — left (0) to right (100)
  // Y: supportive score — top in SVG = high supportive (inverted)
  const dotX = X0 + (result.directiveScore / 100) * PW
  const dotY = Y0 + (1 - result.supportiveScore / 100) * PH
  const dotColor = STYLE_COLORS[result.primaryStyle]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: '480px', display: 'block', margin: '0 auto' }}
      aria-label={`Leadership quadrant. Your dot lands in the ${STYLE_LABELS[result.primaryStyle].name} quadrant.`}
    >
      {/* ── Plot area background ─────────────────────── */}
      <rect
        x={X0}
        y={Y0}
        width={PW}
        height={PH}
        fill="#f1f3f2"
        stroke="#9aa4ae"
        strokeWidth="1"
      />

      {/* ── Subtle grid dots ─────────────────────────── */}
      {[0.25, 0.5, 0.75].flatMap((fx) =>
        [0.25, 0.5, 0.75].map((fy) => (
          <circle
            key={`dot-${fx}-${fy}`}
            cx={X0 + fx * PW}
            cy={Y0 + fy * PH}
            r="1.5"
            fill="#9aa4ae"
            opacity="0.35"
          />
        ))
      )}

      {/* ── Quadrant dividers ─────────────────────────── */}
      <line
        x1={CX}
        y1={Y0}
        x2={CX}
        y2={Y1}
        stroke="#9aa4ae"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <line
        x1={X0}
        y1={CY}
        x2={X1}
        y2={CY}
        stroke="#9aa4ae"
        strokeWidth="1"
        strokeDasharray="3 5"
      />

      {/* ── Quadrant labels ───────────────────────────── */}
      {QUADRANT_CENTERS.map(({ style, x, y }) => {
        const isPrimary = result.primaryStyle === style
        const color = STYLE_COLORS[style]
        return (
          <g key={style} opacity={isPrimary ? 1 : 0.28}>
            <text
              x={x}
              y={y - 7}
              textAnchor="middle"
              fill={color}
              fontSize="14"
              fontWeight="700"
              fontFamily="var(--font-mono, monospace)"
              letterSpacing="0.04em"
            >
              {STYLE_LABELS[style].short}
            </text>
            <text
              x={x}
              y={y + 10}
              textAnchor="middle"
              fill={color}
              fontSize="10"
              fontFamily="var(--font-sans, sans-serif)"
            >
              {STYLE_LABELS[style].name}
            </text>
          </g>
        )
      })}

      {/* ── Axis: Directive (X) ───────────────────────── */}
      {/* border ticks */}
      <line x1={CX} y1={Y1} x2={CX} y2={Y1 + 5} stroke="#9aa4ae" strokeWidth="1" />
      <line x1={X0} y1={Y1} x2={X0} y2={Y1 + 5} stroke="#9aa4ae" strokeWidth="1" />
      <line x1={X1} y1={Y1} x2={X1} y2={Y1 + 5} stroke="#9aa4ae" strokeWidth="1" />
      {/* label */}
      <text
        x={CX}
        y={Y1 + 32}
        textAnchor="middle"
        fill="#161a1f"
        fontSize="10"
        fontFamily="var(--font-mono, monospace)"
        letterSpacing="0.06em"
      >
        DIRECTIVE →
      </text>
      <text
        x={X0 + 4}
        y={Y1 + 19}
        fill="#9aa4ae"
        fontSize="8"
        fontFamily="var(--font-mono, monospace)"
      >
        low
      </text>
      <text
        x={X1 - 4}
        y={Y1 + 19}
        textAnchor="end"
        fill="#9aa4ae"
        fontSize="8"
        fontFamily="var(--font-mono, monospace)"
      >
        high
      </text>

      {/* ── Axis: Supportive (Y) ─────────────────────── */}
      <line x1={X0} y1={CY} x2={X0 - 5} y2={CY} stroke="#9aa4ae" strokeWidth="1" />
      <line x1={X0} y1={Y0} x2={X0 - 5} y2={Y0} stroke="#9aa4ae" strokeWidth="1" />
      <line x1={X0} y1={Y1} x2={X0 - 5} y2={Y1} stroke="#9aa4ae" strokeWidth="1" />
      <text
        x={X0 - 42}
        y={CY}
        textAnchor="middle"
        fill="#161a1f"
        fontSize="10"
        fontFamily="var(--font-mono, monospace)"
        letterSpacing="0.06em"
        transform={`rotate(-90, ${X0 - 42}, ${CY})`}
      >
        SUPPORTIVE →
      </text>
      <text
        x={X0 - 10}
        y={Y1 - 2}
        textAnchor="middle"
        fill="#9aa4ae"
        fontSize="8"
        fontFamily="var(--font-mono, monospace)"
      >
        low
      </text>
      <text
        x={X0 - 10}
        y={Y0 + 10}
        textAnchor="middle"
        fill="#9aa4ae"
        fontSize="8"
        fontFamily="var(--font-mono, monospace)"
      >
        high
      </text>

      {/* ── Score annotations on axes ────────────────── */}
      <text
        x={dotX}
        y={Y1 + 19}
        textAnchor="middle"
        fill={dotColor}
        fontSize="8"
        fontFamily="var(--font-mono, monospace)"
        fontWeight="700"
      >
        {result.directiveScore}
      </text>
      <text
        x={X0 - 10}
        y={dotY + 3}
        textAnchor="middle"
        fill={dotColor}
        fontSize="8"
        fontFamily="var(--font-mono, monospace)"
        fontWeight="700"
      >
        {result.supportiveScore}
      </text>

      {/* ── Crosshair lines to dot ───────────────────── */}
      {animated && (
        <>
          <line
            x1={dotX}
            y1={Y0}
            x2={dotX}
            y2={dotY}
            stroke={dotColor}
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.35"
          />
          <line
            x1={X0}
            y1={dotY}
            x2={dotX}
            y2={dotY}
            stroke={dotColor}
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.35"
          />
        </>
      )}

      {/* ── Animated dot ─────────────────────────────── */}
      {animated && (
        <g className="dot-settle" style={{ transformOrigin: `${dotX}px ${dotY}px` }}>
          {/* outer glow */}
          <circle cx={dotX} cy={dotY} r="18" fill={dotColor} opacity="0.1" />
          {/* ring */}
          <circle
            cx={dotX}
            cy={dotY}
            r="11"
            fill="none"
            stroke={dotColor}
            strokeWidth="1.5"
            opacity="0.4"
          />
          {/* main dot */}
          <circle cx={dotX} cy={dotY} r="8" fill={dotColor} />
          {/* center */}
          <circle cx={dotX} cy={dotY} r="2.5" fill="#f1f3f2" />
        </g>
      )}
    </svg>
  )
}
