'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('moduslead_theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem('moduslead_theme', nextTheme)
  }

  if (!mounted) {
    return (
      <div
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs opacity-0"
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-full border border-border hover:border-border-strong transition-all flex items-center justify-center text-xs sm:text-sm focus:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--ink)',
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
