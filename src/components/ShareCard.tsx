'use client'

import { useState, useRef } from 'react'
import type { Style, ScoreResult } from '@/lib/types'
import { STYLE_COLORS, STYLE_LABELS, STYLE_PROFILES, accuracyCopy } from '@/lib/copy'
import { encodeResult } from '@/lib/scoring'

interface ShareCardProps {
  result: ScoreResult
  onRetake: () => void
}

export default function ShareCard({ result, onRetake }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const primaryColor = STYLE_COLORS[result.primaryStyle]
  const primaryProfile = STYLE_PROFILES[result.primaryStyle]
  const accuracy = accuracyCopy(result)

  async function handleCopyLink() {
    const encoded = encodeResult(result)
    const url = `${window.location.origin}${window.location.pathname}?r=${encoded}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: select and prompt manual copy
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  function handleShareLinkedIn() {
    const encoded = encodeResult(result)
    const url = `${window.location.origin}${window.location.pathname}?r=${encoded}`
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  function handleShareTwitter() {
    const encoded = encodeResult(result)
    const url = `${window.location.origin}${window.location.pathname}?r=${encoded}`
    const text = `I just completed the ModusLead Situational Leadership Diagnostic! My primary style is ${STYLE_PROFILES[result.primaryStyle].name} (${result.situationalAccuracy}% Situational Accuracy). Discover how you lead:`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  async function handleDownloadOg() {
    const encoded = encodeResult(result)
    const ogUrl = `/api/og?r=${encoded}`
    try {
      const response = await fetch(ogUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `moduslead-${result.primaryStyle.toLowerCase()}-card.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(ogUrl, '_blank')
    }
  }

  return (
    <div>
      {/* ── The shareable card itself ──────────────────────────────── */}
      <div
        ref={cardRef}
        id="share-card"
        className="p-6"
        style={{
          backgroundColor: '#161a1f',
          border: `1px solid ${primaryColor}30`,
        }}
      >
        {/* Tool name */}
        <div
          className="text-xs mb-4 tracking-widest"
          style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
        >
          MODUSLEAD · LEADERSHIP DIAGNOSTIC
        </div>

        {/* Primary style hero */}
        <div className="mb-5">
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="text-2xl font-bold"
              style={{ color: primaryColor, fontFamily: 'var(--font-mono, monospace)' }}
            >
              {STYLE_LABELS[result.primaryStyle].short}
            </span>
            <span className="text-xl font-bold" style={{ color: '#f1f3f2' }}>
              {STYLE_PROFILES[result.primaryStyle].name}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(241,243,242,0.6)' }}>
            {primaryProfile.tagline}
          </p>
        </div>

        {/* Mini distribution bars */}
        <div className="space-y-1.5 mb-5">
          {(['S2', 'S1', 'S3', 'S4'] as Style[])
            .sort((a, b) => result.styleCounts[b] - result.styleCounts[a])
            .map((style) => {
              const pct = result.styleDistribution[style]
              const isPrimary = result.primaryStyle === style
              return (
                <div key={style} className="flex items-center gap-2">
                  <span
                    className="text-xs w-6 shrink-0"
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      color: STYLE_COLORS[style],
                    }}
                  >
                    {style}
                  </span>
                  <div
                    className="flex-1 h-3 relative"
                    style={{ backgroundColor: 'rgba(154,164,174,0.12)' }}
                  >
                    <div
                      className="h-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: STYLE_COLORS[style],
                        opacity: isPrimary ? 1 : 0.35,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs w-8 text-right shrink-0"
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      color: isPrimary ? STYLE_COLORS[style] : 'rgba(154,164,174,0.6)',
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              )
            })}
        </div>

        {/* Accuracy score */}
        <div
          className="flex items-center justify-between py-3 px-0"
          style={{ borderTop: '1px solid rgba(154,164,174,0.2)' }}
        >
          <span
            className="text-xs"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: '#9aa4ae' }}
          >
            Situational accuracy
          </span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-mono, monospace)', color: primaryColor }}
          >
            {result.situationalAccuracy}%
          </span>
        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <div className="space-y-3 mt-5">
        {/* Social Share Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={handleShareLinkedIn}
            className="py-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 focus:outline-none"
            style={{
              backgroundColor: '#0077b512',
              borderColor: '#0077b5',
              color: '#0077b5',
            }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0077b5'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#ffffff'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0077b512'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#0077b5'
            }}
          >
            <span>in</span> Share on LinkedIn
          </button>

          <button
            onClick={handleShareTwitter}
            className="py-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-strong)',
              color: 'var(--ink)',
            }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--ink)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--bg)'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-subtle)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'
            }}
          >
            <span>𝕏</span> Share on X
          </button>

          <button
            onClick={handleCopyLink}
            className="py-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-all border focus:outline-none"
            style={{
              backgroundColor: copied ? 'var(--s2)' : 'var(--bg-subtle)',
              borderColor: copied ? 'var(--s2)' : 'var(--border-strong)',
              color: copied ? '#ffffff' : 'var(--ink)',
            }}
          >
            {copied ? '✓ Link copied' : 'Copy Share Link'}
          </button>
        </div>

        {/* Download & Retake Row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleDownloadOg}
            className="flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border focus:outline-none shadow-sm"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: '#ffffff',
            }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }}
          >
            ↓ Download Social Card (PNG)
          </button>

          <button
            onClick={onRetake}
            className="flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border focus:outline-none"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border)',
              color: 'var(--ink-secondary)',
            }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-secondary)'
            }}
          >
            Retake assessment
          </button>
        </div>
      </div>
    </div>
  )
}
