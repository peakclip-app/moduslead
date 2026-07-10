import type { Style, ScoreResult } from './types'

export const STYLE_COLORS: Record<Style, string> = {
  S1: '#4A6FA5',
  S2: '#3D8B83',
  S3: '#C98A3B',
  S4: '#8B5A7C',
}

export const STYLE_LABELS: Record<Style, { short: string; name: string }> = {
  S1: { short: 'S1', name: 'Directing' },
  S2: { short: 'S2', name: 'Coaching' },
  S3: { short: 'S3', name: 'Supporting' },
  S4: { short: 'S4', name: 'Delegating' },
}

export const STYLE_PROFILES: Record<
  Style,
  {
    name: string
    tagline: string
    description: string
    strength: string
    blindSpot: string
    developmentFocus: string
  }
> = {
  S1: {
    name: 'Directing',
    tagline: 'You create clarity.',
    description:
      'Clear, structured, and hands-on instruction where you tell people what to do, how to do it, and when it\'s due. New team members know exactly where they stand.',
    strength:
      'You give people total clarity. No one on your team wonders what\'s expected of them, especially when they\'re new to a task.',
    blindSpot:
      'You\'re light on two-way dialogue and emotional support. With people who have the skill but need confidence rather than more instruction, this can feel like you don\'t quite trust them yet.',
    developmentFocus:
      'Practice distinguishing between skill gaps and confidence gaps. Someone who keeps double-checking may not need more structure; they may need you to name what you\'ve seen in their work and step back.',
  },
  S2: {
    name: 'Coaching',
    tagline: 'You develop people, not just outputs.',
    description:
      'High direction paired with high support where you explain your reasoning, invite questions, and build skill and confidence at the same time. The rarest leadership mode.',
    strength:
      'You don\'t just hand off tasks, you build the judgment behind them. People who\'ve worked with you tend to get better at their work.',
    blindSpot:
      'Coaching is the most effortful style and can become the default even when someone is clearly ready for full autonomy. With high performers, too much coaching signals a lack of trust.',
    developmentFocus:
      'Develop your ability to let go cleanly. When someone has demonstrated both skill and confidence, the most developmental thing you can do is give them real ownership instead of more dialogue.',
  },
  S3: {
    name: 'Supporting',
    tagline: 'You give people permission to trust themselves.',
    description:
      'Low direction paired with high support where you step back from telling people how to do the work, but stay close by encouraging, listening, and building confidence in those who already have the skill.',
    strength:
      'You know when someone doesn\'t need more instruction, they need permission. Capable people who second-guess themselves tend to re-find their footing under your leadership.',
    blindSpot:
      'You\'re rarely explicit about expectations, especially early in someone\'s tenure. With people who are still developing skill (not just confidence), the absence of structure reads as abandonment.',
    developmentFocus:
      'Practice reading whether a gap is about skill or confidence before choosing your approach. When someone is genuinely new to a task, clear expectations and checkpoints are a form of care, not control.',
  },
  S4: {
    name: 'Delegating',
    tagline: 'You give real ownership.',
    description:
      'Low direction paired with low support where you hand off real ownership and trust people to run with it, stepping in only when asked. Your strongest people get to do their best work.',
    strength:
      'You scale. You don\'t create bottlenecks. High performers in your orbit get the autonomy they need to actually grow.',
    blindSpot:
      'You move to full delegation quickly, sometimes before someone has the skill or confidence for it. The people who need structure or encouragement can feel invisible under your management.',
    developmentFocus:
      'Develop your diagnostic muscle: before delegating, ask whether this person has both the competence and the confidence for this specific task. The answer can be yes for one task and no for another, even with the same person on the same day.',
  },
}

// ─── Accuracy narrative ─────────────────────────────────────────────────────

export function accuracyCopy(result: ScoreResult): {
  label: string
  headline: string
  body: string
} {
  const { situationalAccuracy, primaryStyle } = result
  const primaryName = STYLE_PROFILES[primaryStyle].name

  if (situationalAccuracy >= 75) {
    return {
      label: 'Strong',
      headline: 'You read the room.',
      body: 'Your responses matched the textbook-correct style for the situation most of the time. Not everyone gets the same playbook from you, and that adaptability is the single strongest predictor of leadership effectiveness in this model.',
    }
  }

  if (situationalAccuracy >= 50) {
    return {
      label: 'Developing',
      headline: 'Good instincts, recognizable pattern.',
      body: `You adapt reasonably well, but there's a pull: under pressure or ambiguity, you tend to reach for ${primaryName}. That's not wrong on its own, but it means some people are likely getting more or less than they need from you depending on where they fall relative to your default style.`,
    }
  }

  return {
    label: 'Developing',
    headline: 'One style does a lot of lifting.',
    body: `Your answers suggest a fairly consistent approach regardless of the person's readiness level. ${primaryName} is your go-to, which serves some team members well and undersupports others. The diagnostic opportunity here is learning to spot the difference before choosing your approach.`,
  }
}

// ─── Combined development section ───────────────────────────────────────────

export function developmentCopy(result: ScoreResult): string {
  const { primaryStyle, leastUsedStyle, situationalAccuracy } = result
  const leastName = STYLE_PROFILES[leastUsedStyle].name

  const base = STYLE_PROFILES[primaryStyle].developmentFocus

  if (situationalAccuracy >= 75) {
    return `${base} One specific area to explore: the ${leastName} mode, which you rarely reached for. That's not always a gap, but in scenarios where it was the right call, leaning into it more deliberately would raise your ceiling.`
  }

  return `${base} The style you reached for least was ${leastName}. Building familiarity with it would directly address the situations where your default approach wasn't the best fit.`
}
