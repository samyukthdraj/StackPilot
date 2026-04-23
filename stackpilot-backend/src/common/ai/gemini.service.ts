import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiGenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly baseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly model = 'gemini-2.5-flash-lite';

  constructor(private configService: ConfigService) {}

  async generateContent(
    parts: GeminiContentPart[],
    config: GeminiGenerationConfig = {},
  ): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in configuration');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: config.temperature ?? 0.1,
              maxOutputTokens: config.maxOutputTokens ?? 4096,
              responseMimeType: config.responseMimeType ?? 'application/json',
            },
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errText}`);
      }

      const data = (await response.json()) as GeminiResponse;
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      // Clean up markdown fences if present
      return rawText.replace(/```(?:json)?\n?|```/g, '').trim();
    } catch (error) {
      this.logger.error('Gemini content generation failed:', error);
      throw error;
    }
  }
}
