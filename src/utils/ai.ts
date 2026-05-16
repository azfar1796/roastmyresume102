import { AnalysisResult, JobMatchResult, InterviewQuestion, SalaryInsight } from '../types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
  };
}

async function callGroq(system: string, user: string, temperature = 0.7, maxTokens = 2000): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || `HTTP ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function analyzeResume(resumeText: string, tone: string, jobDescription: string): Promise<AnalysisResult> {
  const prompt = `
You are an elite ATS analyst and sharp but constructive career coach. Roast this resume with wit and humor. Never attack the person, only the resume.
Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.
{
  "atsScore": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "technicalClarity": <number 0-100>,
  "roast": "<one witty paragraph roasting the resume>",
  "atsIssues": ["<issue 1>", "<issue 2>", "<issue 3>", "<issue 4>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "rewrittenBullets": [
    { "before": "<original bullet>", "after": "<improved bullet>" },
    { "before": "<original bullet>", "after": "<improved bullet>" },
    { "before": "<original bullet>", "after": "<improved bullet>" }
  ],
  "finalVerdict": "<one punchy sentence final verdict>"
}
Tone: ${tone}
Resume: ${resumeText}
${jobDescription ? "Job Description: " + jobDescription : ""}
  `;

  const text = await callGroq(
    'You are an elite resume reviewer. Always respond with valid JSON only. No markdown. No backticks. No explanation.',
    prompt,
    0.8,
    2000
  );
  return parseJSON<AnalysisResult>(text);
}

export async function fixResume(
  resumeText: string,
  roast: string,
  atsIssues: string[],
  suggestions: string[]
): Promise<string> {
  const prompt = `
You are an expert resume writer. Based on this resume and the AI feedback below, rewrite the entire resume to be significantly better.

Original Resume:
${resumeText}

AI Roast:
${roast}

ATS Issues to fix:
${atsIssues.join('\n')}

Suggestions to implement:
${suggestions.join('\n')}

Rewrite the full resume with:
- Strong action verbs on every bullet
- Quantified achievements with real-sounding metrics
- ATS-friendly formatting
- Clear sections: Summary, Experience, Skills, Education
- No buzzword fluff
- Every bullet shows impact not just responsibility
- Professional but confident tone

Return ONLY the rewritten resume text. No explanation. No markdown. Just the clean resume text ready to copy or download.
  `;

  return callGroq(
    'You are an expert resume writer. Return only the rewritten resume text. No markdown. No explanation.',
    prompt,
    0.7,
    3000
  );
}

export async function scoreJobMatch(resumeText: string, jobDescription: string): Promise<JobMatchResult> {
  const prompt = `
Compare this resume to this job description. Analyze keyword matches, skill alignment, and experience relevance.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON:
{
  "matchScore": <number 0-100>,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "strongMatches": ["match1", "match2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}
  `;

  const text = await callGroq(
    'You are an ATS matching expert. Always respond with valid JSON only. No markdown. No backticks.',
    prompt,
    0.5,
    1500
  );
  return parseJSON<JobMatchResult>(text);
}

export async function tailorResume(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `
Rewrite this resume to perfectly target this job description.
Keep all real experience but reframe bullets to match the JD keywords.
Add relevant keywords naturally. Make every bullet demonstrate value for this specific role.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return only the rewritten resume text. No explanation. No markdown.
  `;

  return callGroq(
    'You are an expert resume tailor. Return only the rewritten resume text optimized for the target job.',
    prompt,
    0.7,
    3000
  );
}

export async function generateCoverLetter(resumeText: string, jobDescription: string, tone: string): Promise<string> {
  const prompt = `
Write a compelling cover letter for this candidate applying to this job.
Use their resume for experience details.
Tone: ${tone}

Resume:
${resumeText}

Job Description:
${jobDescription}

Make it sound human, specific, and genuinely excited.
3 paragraphs max. No generic fluff. Show you understand the company and role.
Return only the cover letter text.
  `;

  return callGroq(
    `You are an expert cover letter writer. Write in a ${tone} tone. Return only the cover letter text.`,
    prompt,
    0.8,
    1500
  );
}

export async function generateInterviewQuestions(resumeText: string, jobDescription: string): Promise<InterviewQuestion[]> {
  const prompt = `
Based on this resume and job description, generate 10 interview questions the candidate is likely to face.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : 'No specific job description provided - generate general questions based on their experience.'}

Generate exactly:
- 3 behavioral (tell me about a time...)
- 3 technical (based on their skills)
- 2 situational (what would you do if...)
- 1 culture fit
- 1 closing (do you have any questions for us?)

For each question provide an ideal answer based on THEIR specific resume experience.

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "...",
      "category": "behavioral" | "technical" | "situational" | "culture" | "closing",
      "difficulty": "easy" | "medium" | "hard",
      "idealAnswer": "..."
    }
  ]
}
  `;

  const text = await callGroq(
    'You are an expert interview coach. Always respond with valid JSON only. No markdown. No backticks.',
    prompt,
    0.7,
    3000
  );
  const parsed = parseJSON<{ questions: InterviewQuestion[] }>(text);
  return parsed.questions;
}

export async function generateLinkedInHeadlines(resumeText: string): Promise<string[]> {
  const prompt = `
Based on this resume write 5 LinkedIn headline options.
Each under 220 characters. Professional, specific, keyword-rich.
Show their value proposition clearly.

Resume:
${resumeText}

Return ONLY valid JSON: { "headlines": ["headline1", "headline2", "headline3", "headline4", "headline5"] }
  `;

  const text = await callGroq(
    'You are a LinkedIn optimization expert. Return only valid JSON.',
    prompt,
    0.8,
    800
  );
  const parsed = parseJSON<{ headlines: string[] }>(text);
  return parsed.headlines;
}

export async function generateLinkedInSummary(resumeText: string): Promise<string> {
  const prompt = `
Write a LinkedIn About section for this candidate.
3 paragraphs. First person. Conversational but professional.
Highlight their biggest strengths and what makes them unique.
End with what they are looking for.

Resume:
${resumeText}

Return only the text. No markdown. No explanation.
  `;

  return callGroq(
    'You are a LinkedIn copywriting expert. Write compelling About sections.',
    prompt,
    0.8,
    1200
  );
}

export async function getSalaryInsights(resumeText: string): Promise<SalaryInsight> {
  const prompt = `
Based on this resume, estimate salary information for this candidate's profile.
Consider their skills, years of experience, industry, and seniority level.

Resume:
${resumeText}

Return ONLY valid JSON:
{
  "estimatedRange": { "min": <number>, "max": <number>, "currency": "USD" },
  "level": "entry" | "mid" | "senior",
  "topHiringCities": ["city1", "city2", "city3"],
  "salaryBoostSkills": ["skill1", "skill2", "skill3", "skill4"]
}
  `;

  const text = await callGroq(
    'You are a compensation analyst. Return only valid JSON with realistic salary estimates.',
    prompt,
    0.5,
    800
  );
  return parseJSON<SalaryInsight>(text);
}
