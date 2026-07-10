import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f3f2' },
    { media: '(prefers-color-scheme: dark)', color: '#111418' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://moduslead.app'),
  title: 'ModusLead — Leadership Style Diagnostic',
  description:
    '16 real management scenarios. Your honest responses. A personalized map of how you lead — and where you have gaps. Based on Hersey & Blanchard\'s Situational Leadership model.',
  openGraph: {
    title: 'ModusLead — Leadership Style Diagnostic',
    description: 'Find out how you actually lead. 8 minutes. Based on Situational Leadership theory.',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'ModusLead Situational Leadership Diagnostic',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ModusLead — Leadership Style Diagnostic',
    description: 'Find out how you actually lead. 8 minutes. Based on Situational Leadership theory.',
    images: ['/api/og'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-[100dvh] flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  )
}
