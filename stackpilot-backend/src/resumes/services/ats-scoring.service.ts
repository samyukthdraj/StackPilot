import { Injectable, Logger } from '@nestjs/common';
import { StructuredResumeData } from '../entities/resume.entity';

export interface ATSScoreBreakdown {
  skillMatch: number;
  projectStrength: number;
  experienceRelevance: number;
  resumeStructure: number;
  keywordDensity: number;
  actionVerbs: number;
  total: number;
  // AI-generated fields
  feedback?: string; // 2–3 sentence plain-English summary
  suggestions?: string[]; // concrete, actionable improvements
  strengths?: string[]; // what the resume does well
}

@Injectable()
export class ATSScoringService {
  private readonly logger = new Logger(ATSScoringService.name);

  async calculateScore(
    resumeData: StructuredResumeData,
    targetJobDescription?: string,
  ): Promise<ATSScoreBreakdown> {
    const isEmpty =
      !resumeData ||
      (resumeData.skills.length === 0 &&
        resumeData.experience.length === 0 &&
        resumeData.projects.length === 0);

    if (isEmpty) {
      this.logger.warn('Empty resume data — returning zero score.');
      return this.zeroScore(
        'Resume could not be parsed. Please ensure the PDF contains selectable text.',
      );
    }

    let prompt = `You are a strict, enterprise-grade ATS (Applicant Tracking System) parsing algorithm (functioning like Taleo, Workday, or Greenhouse). You evaluate resumes strictly based on keyword parsing, structural standardization, quantifiable metrics, and Boolean match density. Do not evaluate like an empathetic human. Analyze the structured resume data below and return a JSON scoring object.

STRUCTURED RESUME DATA:
${JSON.stringify(resumeData, null, 2)}`;

    if (targetJobDescription && targetJobDescription.trim().length > 0) {
      prompt += `
      
TARGET JOB DESCRIPTION:
${targetJobDescription}

Evaluate the resume objectively using industry-standard algorithmic ATS checks across six categories on a scale of 0–100 (where 50 is average, 75 is strong, and 90+ is exceptional). Deduct points proportionally if the resume fails algorithmic extraction or does not match the TARGET JOB DESCRIPTION, but do not assign 0 unless a section is completely missing:

1. skillMatch (0–100): Exact and Boolean matching of hard skills required in the job description. Deduct points for missing mandatory technical/domain skills.
2. projectStrength (0–100): Presence of quantifiable metrics (%, $, scaling numbers) and measurable impact. ATS algorithms strongly favor bullet points containing numerical facts.
3. experienceRelevance (0–100): Direct semantic overlap of past job titles and parsed responsibilities with the target role. Deduct heavily for missing chronological dates or non-standard titles.
4. resumeStructure (0–100): Parsing coherence. Are core sections (Contact, Summary, Skills, Experience, Education) clearly defined and fully extracted? Deduct if data seems lumped together.
5. keywordDensity (0–100): Frequency (TF-IDF) of critical keywords relevant to the target job description. Score optimally for natural repetition in context; penalize heavily for keyword stuffing (invisible text or list spam) or if keywords are missing from experience.
6. actionVerbs (0–100): Algorithmic check for strong, past-tense action verbs (e.g., Architected, Optimized, Spearheaded) literally at the start of bullet points.
`;
    } else {
      prompt += `

Evaluate the resume objectively using industry-standard ATS algorithms across six categories on a scale of 0–100 (where 50 is average, 75 is strong, and 90+ is exceptional). Deduct points for poor formatting, missing dates, or lack of quantifiable metrics, but do not assign a 0 unless the section is entirely missing:

1. skillMatch (0–100): Density and variety of hard technical/domain skills commonly recognized by standard ATS taxonomies.
2. projectStrength (0–100): Presence of quantifiable metrics (%, $, scaling numbers). Industrial ATS systems highly rank resumes that use numbers to prove impact.
3. experienceRelevance (0–100): Clarity and standardization of job titles and descriptions. Deduct heavily if chronological dates are missing, or if job titles are unconventional and fail semantic matching.
4. resumeStructure (0–100): Parsing coherence. Are core sections (Contact, Experience, Skills, Education) explicitly segregated? Deduct if the structural extraction is poor or missing.
5. keywordDensity (0–100): Organic integration of key industry terms. Deduct points if requested skills are just listed in a block rather than contextualized within experience bullet points.
6. actionVerbs (0–100): Strict evaluation of bullet points starting with strong action verbs (e.g., Deployed, Orchestrated, Mitigated).
`;
    }

    prompt += `
Calculate:
  total = round(skillMatch*0.40 + projectStrength*0.20 + experienceRelevance*0.15 + resumeStructure*0.10 + keywordDensity*0.10 + actionVerbs*0.05)
  Clamp total between 0 and 100.

Also produce:
- feedback: A 2–3 sentence plain-English summary of the resume's overall ATS readiness.
- strengths: Array of 2–4 specific things this resume does well.
- suggestions: Array of 3–6 concrete, actionable improvements the candidate can make RIGHT NOW (be specific, not generic).

Return ONLY a JSON object in this exact shape — no markdown, no code fences, no extra text:
{
  "skillMatch": number,
  "projectStrength": number,
  "experienceRelevance": number,
  "resumeStructure": number,
  "keywordDensity": number,
  "actionVerbs": number,
  "total": number,
  "feedback": string,
  "strengths": string[],
  "suggestions": string[]
}`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1500,
              responseMimeType: 'application/json',
            },
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errText}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const rawJson: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      const clean = rawJson.replace(/```(?:json)?\n?|```/g, '').trim();
      let result: ATSScoreBreakdown;
      try {
        result = JSON.parse(clean) as ATSScoreBreakdown;
      } catch (e) {
        this.logger.error('Failed to parse ATS Score JSON from Gemini:', clean);
        throw e;
      }

      // Validate and clamp all numeric fields
      const clamp = (v: unknown) =>
        Math.min(100, Math.max(0, Math.round(Number(v) || 0)));

      const breakdown: ATSScoreBreakdown = {
        skillMatch: clamp(result.skillMatch),
        projectStrength: clamp(result.projectStrength),
        experienceRelevance: clamp(result.experienceRelevance),
        resumeStructure: clamp(result.resumeStructure),
        keywordDensity: clamp(result.keywordDensity),
        actionVerbs: clamp(result.actionVerbs),
        total: clamp(result.total),
        feedback: result.feedback ?? '',
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        suggestions: Array.isArray(result.suggestions)
          ? result.suggestions
          : [],
      };

      this.logger.log(`Gemini ATS score: ${breakdown.total}/100`);
      return breakdown;
    } catch (error) {
      this.logger.error('Gemini ATS scoring failed:', error);
      return this.zeroScore(
        'Scoring temporarily unavailable. Please try re-uploading your resume.',
      );
    }
  }

  private zeroScore(feedback: string): ATSScoreBreakdown {
    return {
      skillMatch: 0,
      projectStrength: 0,
      experienceRelevance: 0,
      resumeStructure: 0,
      keywordDensity: 0,
      actionVerbs: 0,
      total: 0,
      feedback,
      strengths: [],
      suggestions: [],
    };
  }
}
