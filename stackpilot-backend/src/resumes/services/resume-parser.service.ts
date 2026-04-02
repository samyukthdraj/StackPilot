import { Injectable, Logger } from '@nestjs/common';
import { StructuredResumeData } from '../entities/resume.entity';

@Injectable()
export class ResumeParserService {
  private readonly logger = new Logger(ResumeParserService.name);

  async parseResume(
    base64Data: string,
    mimeType: string,
  ): Promise<StructuredResumeData> {
    if (!base64Data) {
      this.logger.warn('Received empty file data — returning empty structure.');
      return { skills: [], experience: [], projects: [], education: [] };
    }

    const prompt = `You are an expert resume parser. Extract structured information from the attached PDF resume and return ONLY a valid JSON object — no markdown fences, no explanation, no extra text.

The JSON must conform to this exact shape:
{
  "personalInfo": {
    "name": string (optional),
    "email": string (optional),
    "phone": string (optional),
    "location": string (optional),
    "linkedin": string (optional),
    "github": string (optional),
    "website": string (optional)
  },
  "summary": string (optional),
  "skills": string[],
  "experience": [
    {
      "company": string,
      "title": string,
      "startDate": string (optional),
      "endDate": string (optional),
      "description": string[],
      "technologies": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[],
      "url": string (optional)
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "field": string (optional),
      "graduationYear": string (optional),
      "gpa": string (optional)
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string (optional),
      "year": string (optional)
    }
  ] (optional)
}

Rules:
- skills[] must contain ALL technologies and tools mentioned anywhere in the resume (deduplicated, lowercase).
- For experience[].description, split bullet points into individual strings.
- If a field is absent from the resume, omit it or use an empty array — never invent data.
- Return raw JSON only. No markdown, no backtick fences, no preamble.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment');

      // Using Flash-Lite: 15 RPM, 1000 RPD — best free throughput
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1, // low temp = consistent structured JSON output
              maxOutputTokens: 4096,
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

      // With application/json, it shouldn't contain fences, but clean just in case
      const clean = rawJson.replace(/```(?:json)?\n?|```/g, '').trim();
      let parsed: StructuredResumeData;
      try {
        parsed = JSON.parse(clean) as StructuredResumeData;
      } catch (e) {
        this.logger.error('Failed to parse Gemini output as JSON:', clean);
        throw e;
      }

      // Guarantee required arrays are always present
      parsed.skills = parsed.skills ?? [];
      parsed.experience = parsed.experience ?? [];
      parsed.projects = parsed.projects ?? [];
      parsed.education = parsed.education ?? [];

      this.logger.log(
        `Gemini parsed resume: ${parsed.skills.length} skills, ` +
          `${parsed.experience.length} jobs, ${parsed.projects.length} projects`,
      );

      return parsed;
    } catch (error) {
      this.logger.error('Gemini resume parsing failed:', error);
      return { skills: [], experience: [], projects: [], education: [] };
    }
  }
}
