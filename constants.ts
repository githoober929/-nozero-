export const STORAGE_KEY = 'no-zero-day-data-v2';

export const CATEGORIES = [
  { id: 'mental', label: 'Mental', color: 'bg-indigo-500', text: 'text-indigo-400' },
  { id: 'physical', label: 'Physical', color: 'bg-orange-500', text: 'text-orange-400' },
  { id: 'career', label: 'Career', color: 'bg-blue-500', text: 'text-blue-400' },
  { id: 'health', label: 'Health', color: 'bg-emerald-500', text: 'text-emerald-400' },
  { id: 'relationship', label: 'Relationship', color: 'bg-rose-500', text: 'text-rose-400' },
  { id: 'skill', label: 'Skill', color: 'bg-violet-500', text: 'text-violet-400' },
  { id: 'other', label: 'Other', color: 'bg-slate-500', text: 'text-slate-400' },
] as const;

export const MOTIVATION_PROMPT = `
You are a motivational coach for a user following the "No Zero Days" philosophy.
The user needs a quick boost.
Provide either:
1. A short, punchy motivational quote (max 15 words).
2. A very small, easy "non-zero" task idea that takes less than 5 minutes.
   - IMPORTANT: If generating a task, RANDOMLY select one specific category from: Mental, Physical, Career, Health, Relationship, or Skill. Ensure variety.
   - Examples: "Send a kind text to a friend" (Relationship), "Do 10 squats" (Physical), "Read one paragraph" (Mental), "Organize one desktop folder" (Career), "Meditate for 2 minutes" (Health).

Return the response in this JSON format:
{
  "text": "The content here",
  "type": "quote" OR "task"
}
`;

export const REFLECTION_PROMPT_TEMPLATE = `
You are a calm, reflective journaling assistant.
Generate a short monthly reflection letter for a user of a "No Zero Day" app.

Inputs:
- Total non-zero days: {{totalDays}}
- Most common win category: {{category}}
- Days with low effort but still non-zero: {{lowEffort}}
- Most difficult day of the month (user note): "{{hardestDay}}"

Rules:
- Max 120 words
- No motivational hype
- No guilt or shame
- Emphasize consistency over performance
- Speak like a thoughtful mentor, not a coach
- Output ONLY the letter text.
`;