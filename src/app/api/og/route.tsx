import { ImageResponse } from 'next/og'
import { decodeResult } from '@/lib/scoring'
import { STYLE_COLORS, STYLE_LABELS, STYLE_PROFILES } from '@/lib/copy'
import type { Style } from '@/lib/types'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const r = searchParams.get('r')
    const styleParam = searchParams.get('style') as Style | null
    const accuracyParam = searchParams.get('accuracy')

    let primaryStyle: Style = 'S2'
    let situationalAccuracy = 81
    let isResult = false

    if (r) {
      const decoded = decodeResult(r)
      if (decoded) {
        primaryStyle = decoded.primaryStyle
        situationalAccuracy = decoded.situationalAccuracy
        isResult = true
      }
    } else if (styleParam && STYLE_COLORS[styleParam]) {
      primaryStyle = styleParam
      if (accuracyParam) situationalAccuracy = parseInt(accuracyParam, 10) || 81
      isResult = true
    }

    const primaryColor = STYLE_COLORS[primaryStyle] || '#3D8B83'
    const profile = STYLE_PROFILES[primaryStyle] || STYLE_PROFILES.S2
    const label = STYLE_LABELS[primaryStyle] || STYLE_LABELS.S2

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '70px 80px',
            backgroundColor: '#161A1F',
            border: `12px solid ${isResult ? primaryColor : '#3D8B83'}`,
            fontFamily: 'monospace',
          }}
        >
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#F1F3F2',
                letterSpacing: '0.08em',
              }}
            >
              MODUSLEAD
            </div>
            <div
              style={{
                fontSize: 22,
                color: '#9AA4AE',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              SITUATIONAL LEADERSHIP DIAGNOSTIC
            </div>
          </div>

          {/* Main Hero Section */}
          {isResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  fontSize: 24,
                  color: '#9AA4AE',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                ASSESSMENT RESULT · PRIMARY STYLE
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
                <span
                  style={{
                    fontSize: 84,
                    fontWeight: 900,
                    color: primaryColor,
                  }}
                >
                  {label.short}
                </span>
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 900,
                    color: '#F1F3F2',
                  }}
                >
                  {profile.name}
                </span>
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: primaryColor,
                  fontWeight: 600,
                  marginTop: '8px',
                }}
              >
                {profile.tagline}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  color: '#F1F3F2',
                  lineHeight: 1.1,
                }}
              >
                How do you actually lead?
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: '#9AA4AE',
                  lineHeight: 1.4,
                  maxWidth: '900px',
                }}
              >
                16 real management friction points. Discover your situational accuracy, strengths, and blind spots.
              </div>
            </div>
          )}

          {/* Bottom Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTop: '2px solid rgba(154,164,174,0.3)',
              paddingTop: '32px',
            }}
          >
            {isResult ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: 24, color: '#9AA4AE' }}>SITUATIONAL ACCURACY:</span>
                <span style={{ fontSize: 32, fontWeight: 800, color: primaryColor }}>
                  {situationalAccuracy}%
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 24, color: '#3D8B83', fontWeight: 700 }}>
                TAKE THE 8-MIN ASSESSMENT →
              </div>
            )}
            <div style={{ fontSize: 24, color: '#9AA4AE' }}>moduslead.app</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    return new Response(`Failed to generate social preview image`, { status: 500 })
  }
}
