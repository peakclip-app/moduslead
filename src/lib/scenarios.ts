import type { Scenario } from './types'

export const scenarios: Scenario[] = [
  // ─── R1: Low skill, needs explicit direction ────────────────────────────────
  // Textbook-correct response: S1 (Directing)

  {
    id: 'r1-first-task',
    readiness: 'R1',
    prompt:
      "A new intern joins on their first day and is handed a task they've never done before. They're eager but clearly don't know where to start.",
    options: [
      {
        style: 'S1',
        text: 'Walk them through the exact steps, with clear checkpoints and a deadline for each part.',
      },
      {
        style: 'S2',
        text: 'Explain the steps, then ask them to repeat the plan back to you before they start.',
      },
      {
        style: 'S3',
        text: "Give them the task, tell them you're available if needed, and let them figure out the approach.",
      },
      {
        style: 'S4',
        text: "Hand it off with a deadline and trust them to come to you only if they hit a real blocker.",
      },
    ],
  },

  {
    id: 'r1-unclear-done',
    readiness: 'R1',
    prompt:
      "An intern's work came back with several basic errors. They misunderstood what 'finished' looked like for this task, and the next phase is due in two days.",
    options: [
      {
        style: 'S1',
        text: "Sit with them and define exactly what 'done' means, with explicit checkpoints before the next submission.",
      },
      {
        style: 'S2',
        text: 'Walk through the standard together, then have them explain it back, leaving room for questions.',
      },
      {
        style: 'S3',
        text: 'Tell them you trust their effort and ask them to double-check their own work this time.',
      },
      {
        style: 'S4',
        text: 'Point out the gap briefly and let them sort out the next attempt independently.',
      },
    ],
  },

  {
    id: 'r1-tool-onboarding',
    readiness: 'R1',
    prompt:
      "You've asked an intern to use a project management tool your team relies on. They've never used it before. They opened it, stared at it for ten minutes, and are now asking where to begin.",
    options: [
      {
        style: 'S1',
        text: 'Walk them through it step by step: log in, find the board, create a task, assign it, and set a deadline. Every step, explicitly.',
      },
      {
        style: 'S2',
        text: 'Show them the key steps, explain why each part matters, then have them repeat the process while you watch.',
      },
      {
        style: 'S3',
        text: "Reassure them the tool is intuitive, tell them to explore, and remind them you're available if something trips them up.",
      },
      {
        style: 'S4',
        text: 'Point them to the help docs and let them get themselves unstuck.',
      },
    ],
  },

  {
    id: 'r1-quality-gap',
    readiness: 'R1',
    prompt:
      "An intern submits work that is clearly incomplete by your team's standards, not because they were careless, but because they genuinely didn't know what 'good' looks like on this team.",
    options: [
      {
        style: 'S1',
        text: 'Show them a completed example and explicitly list every criterion their submission needs to hit before resubmitting.',
      },
      {
        style: 'S2',
        text: 'Review the work together, explain the gap between what they submitted and the standard, and invite their questions.',
      },
      {
        style: 'S3',
        text: "Let them know they're close and encourage them to take another pass based on their own judgment.",
      },
      {
        style: 'S4',
        text: 'Send it back with a brief note and let them figure out what needs to improve.',
      },
    ],
  },

  // ─── R2: Developing skill, engaged but inconsistent ─────────────────────────
  // Textbook-correct response: S2 (Coaching)

  {
    id: 'r2-recurring-task',
    readiness: 'R2',
    prompt:
      "An intern who's been on the team three weeks has learned the basics of a recurring task. They're improving but still make small mistakes and look to you for reassurance before submitting.",
    options: [
      {
        style: 'S1',
        text: "Give the same explicit, step-by-step instructions as their first week.",
      },
      {
        style: 'S2',
        text: 'Assign the task, explain your reasoning, and review the work together while reinforcing what works and correcting gently.',
      },
      {
        style: 'S3',
        text: 'Assign it, tell them you trust them, and only check in if they ask.',
      },
      {
        style: 'S4',
        text: 'Hand it off completely and let them own it end-to-end.',
      },
    ],
  },

  {
    id: 'r2-missed-deadline',
    readiness: 'R2',
    prompt:
      "A normally reliable intern misses an internal deadline for the first time because they were overwhelmed by competing priorities and didn't know how to flag it earlier.",
    options: [
      {
        style: 'S1',
        text: 'Set up a priority checklist for them to follow and check that they use it going forward.',
      },
      {
        style: 'S2',
        text: "Talk through what happened, explain how you'd prioritize competing demands, and agree on a way to flag overload earlier.",
      },
      {
        style: 'S3',
        text: "Reassure them it's not a big deal and ask how they're doing, leaving the system-building to them.",
      },
      {
        style: 'S4',
        text: "Note it and move on, trusting they'll self-correct.",
      },
    ],
  },

  {
    id: 'r2-taking-initiative',
    readiness: 'R2',
    prompt:
      "An intern who's been on the team a month starts making small decisions on their own. They are mostly reasonable, but occasionally miss context that would have changed the call. They didn't check in beforehand.",
    options: [
      {
        style: 'S1',
        text: 'Clarify that they need to check with you before making decisions outside their explicitly defined remit.',
      },
      {
        style: 'S2',
        text: "Acknowledge the initiative, walk through the cases where the call was off and explain the missing context, and agree on when to escalate vs. decide independently.",
      },
      {
        style: 'S3',
        text: 'Thank them for taking initiative and tell them to keep trusting their instincts.',
      },
      {
        style: 'S4',
        text: "Say nothing since the decisions weren't wrong enough to address, and the habit will self-correct.",
      },
    ],
  },

  {
    id: 'r2-asking-why',
    readiness: 'R2',
    prompt:
      "An intern who's improving at the work itself keeps asking 'why' behind each process before doing it. They are not trying to stall, but genuinely trying to understand the logic. The questions are smart but slowing them down slightly.",
    options: [
      {
        style: 'S1',
        text: "Redirect them toward just following the process for now. Understanding the reasoning can come once they've built the habit.",
      },
      {
        style: 'S2',
        text: 'Engage with the questions, explain the reasoning, and use it to build their judgment rather than just their compliance.',
      },
      {
        style: 'S3',
        text: "Tell them you appreciate the curiosity and encourage them to keep asking whatever they need to feel confident.",
      },
      {
        style: 'S4',
        text: 'Let them work through the process and find their own answers as they go.',
      },
    ],
  },

  // ─── R3: Has the skill, lacks confidence ────────────────────────────────────
  // Textbook-correct response: S3 (Supporting)

  {
    id: 'r3-overchecking',
    readiness: 'R3',
    prompt:
      "An intern has mastered a recurring task and consistently does it well, but keeps double-checking with you before doing anything slightly outside the usual script, even after you've told them they're ready to handle it alone.",
    options: [
      {
        style: 'S1',
        text: "Reassert the steps and procedures so there's no ambiguity left for them to worry about.",
      },
      {
        style: 'S2',
        text: 'Keep explaining your reasoning and giving feedback on each task, the way you did early on.',
      },
      {
        style: 'S3',
        text: "Acknowledge their skill, ask what's behind the hesitation, and encourage them to trust their own call.",
      },
      {
        style: 'S4',
        text: "Stop checking in and let them find their confidence on their own.",
      },
    ],
  },

  {
    id: 'r3-post-mistake',
    readiness: 'R3',
    prompt:
      "A genuinely capable intern made one visible mistake in a team meeting last week. Since then they've been over-explaining decisions and asking for sign-off on things they used to handle alone.",
    options: [
      {
        style: 'S1',
        text: 'Re-establish detailed, step-by-step guidance until their confidence returns.',
      },
      {
        style: 'S2',
        text: 'Go back to coaching them through tasks with detailed instruction and frequent feedback.',
      },
      {
        style: 'S3',
        text: "Name what you've noticed, reassure them the mistake hasn't changed your view of their ability, and encourage them to trust themselves again.",
      },
      {
        style: 'S4',
        text: "Stop checking in on their work so they realize no one else is worried about it.",
      },
    ],
  },

  {
    id: 'r3-refuses-challenge',
    readiness: 'R3',
    prompt:
      "You offer a capable intern a stretch assignment that is more senior than their usual scope. They decline, saying they're not ready. You've watched them do work this complex already, just in smaller pieces.",
    options: [
      {
        style: 'S1',
        text: "Assign it anyway with a clear brief so there's no ambiguity left for them to worry about.",
      },
      {
        style: 'S2',
        text: "Discuss the assignment in detail by showing them how their existing work maps to what it requires, and agree on checkpoints so they don't feel unsupported.",
      },
      {
        style: 'S3',
        text: "Tell them you're confident in them, sit with the resistance, and ask what would make them feel ready.",
      },
      {
        style: 'S4',
        text: 'Respect the decline and offer it again in a few weeks.',
      },
    ],
  },

  {
    id: 'r3-silent-doubt',
    readiness: 'R3',
    prompt:
      "A team member who clearly has the skills goes noticeably quiet in the days before presenting work to senior leadership. They're second-guessing things they've already resolved well, and their energy has visibly dropped.",
    options: [
      {
        style: 'S1',
        text: "Go through the presentation with them and tighten up anything that needs shoring up structurally.",
      },
      {
        style: 'S2',
        text: 'Do a practice run and provide both technical feedback and reassurance to make the prep feel collaborative rather than evaluative.',
      },
      {
        style: 'S3',
        text: "Tell them directly: you've seen this work, it's solid, and your job right now is to remind them of that.",
      },
      {
        style: 'S4',
        text: "Give them space since they've done hard things before and they'll self-settle before the day.",
      },
    ],
  },

  // ─── R4: High skill, high confidence ────────────────────────────────────────
  // Textbook-correct response: S4 (Delegating)

  {
    id: 'r4-new-complex-task',
    readiness: 'R4',
    prompt:
      'A team member has independently handled a complex part of the project for months, consistently delivering strong work without input. A new, related task comes up.',
    options: [
      {
        style: 'S1',
        text: "Lay out detailed instructions to make sure nothing gets missed.",
      },
      {
        style: 'S2',
        text: 'Explain the task and check in regularly to coach them through it.',
      },
      {
        style: 'S3',
        text: 'Assign it and offer frequent encouragement and emotional support.',
      },
      {
        style: 'S4',
        text: 'Give them the goal and deadline and let them run with it, checking in only at major milestones.',
      },
    ],
  },

  {
    id: 'r4-asks-for-ownership',
    readiness: 'R4',
    prompt:
      "A former intern who's now one of your most reliable people asks to own an entire deliverable end-to-end, including parts that used to route through you first. They've never been wrong on quality before.",
    options: [
      {
        style: 'S1',
        text: 'Say no for now and keep the existing review process in place a while longer.',
      },
      {
        style: 'S2',
        text: 'Say yes, but set up structured check-ins at each major milestone.',
      },
      {
        style: 'S3',
        text: "Say yes, tell them you're confident in them, and stay available emotionally without touching the actual work.",
      },
      {
        style: 'S4',
        text: 'Say yes, hand over real ownership, and ask to be looped in only if something goes seriously wrong.',
      },
    ],
  },

  {
    id: 'r4-disengaged',
    readiness: 'R4',
    prompt:
      "Your strongest team member has started doing the minimum. They are still technically delivering, but clearly bored. They haven't said anything, but you notice fewer questions, less initiative, and shorter responses in async communication.",
    options: [
      {
        style: 'S1',
        text: 'Assign them additional structured work and specific performance targets to re-engage them.',
      },
      {
        style: 'S2',
        text: "Sit down with them, name what you've noticed, and work through what a role that actually challenges them would look like.",
      },
      {
        style: 'S3',
        text: "Check in and let them know you value them while creating space for them to share whatever's behind the change.",
      },
      {
        style: 'S4',
        text: "Give them the hardest thing on your plate and let the work re-engage them on its own.",
      },
    ],
  },

  {
    id: 'r4-mentoring',
    readiness: 'R4',
    prompt:
      "You want a high-performing team member to take on informal mentoring of someone newer by helping them get up to speed, answering questions, and reviewing early work. The experienced person has never mentored before but has all the knowledge required.",
    options: [
      {
        style: 'S1',
        text: 'Give them a structured onboarding guide and specific weekly milestones to run with the new person.',
      },
      {
        style: 'S2',
        text: "Explain what you're looking for from the mentoring relationship, model it briefly, and agree on how you'll check in on their progress as a mentor.",
      },
      {
        style: 'S3',
        text: "Express your confidence in them and let them know you'll be available if they hit anything unexpected in the mentoring dynamic.",
      },
      {
        style: 'S4',
        text: "Ask them to mentor the new person and step back so they can figure out their own approach.",
      },
    ],
  },
]
