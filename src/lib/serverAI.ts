import { config } from './config';

export type TutorRequest = {
  prompt: string;
  language?: 'EN' | 'UR';
};

export type TutorResponse = {
  reply: string;
  reasoning?: string;
};

/**
 * Build the system prompt for educational tutoring.
 */
function getSystemPrompt(language?: 'EN' | 'UR'): string {
  const isUrdu = language === 'UR';
  return isUrdu
    ? `آپ ایک تعلیمی ٹیوٹر اسسٹنٹ ہیں۔ واضح، جامع قدم بہ قدم وضاحتیں فراہم کریں۔ اردو میں جواب دیں۔ Pakistan Punjab Textbook Board (PTB) اور FBISE نصاب پر توجہ دیں۔`
    : `You are an educational tutor assistant for Pakistani students studying PTB and FBISE curricula. Provide clear, concise step-by-step explanations with a friendly, encouraging tone. Use simple English.`;
}

/**
 * Attempt to call the Gemini API with robust error handling and retry logic.
 * Supports gemini-2.0-flash (primary), gemini-1.5-flash (fallback).
 */
async function callGeminiAPI(
  prompt: string,
  systemPrompt: string,
  apiKey: string,
  modelOverride?: string
): Promise<string> {
  // Try models in order — fast and free-tier friendly
  const models = modelOverride
    ? [modelOverride]
    : ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];

  let lastError = '';

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n---\nStudent question: ${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        topP: 0.95
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    try {
      console.log(`[EduAI] Trying Gemini model: ${model}`);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[EduAI] Gemini ${model} returned ${res.status}: ${errText.slice(0, 200)}`);
        lastError = `Gemini ${model} error ${res.status}: ${errText.slice(0, 200)}`;

        // If it's a 400 (bad key) or 403 (forbidden), don't try other models
        if (res.status === 400 || res.status === 403) {
          throw new Error(lastError);
        }
        // For 404 or 429 or 5xx, try next model
        continue;
      }

      const data = await res.json();

      // Extract text from the standard Gemini response
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && typeof text === 'string' && text.trim().length > 0) {
        console.log(`[EduAI] ✅ Gemini ${model} responded successfully (${text.length} chars)`);
        return text.trim();
      }

      // Check if response was blocked by safety filters
      const blockReason = data?.candidates?.[0]?.finishReason;
      if (blockReason === 'SAFETY') {
        console.warn(`[EduAI] Gemini ${model} blocked by safety filter`);
        return "I'm sorry, I can't answer that question. Please try rephrasing it or ask a different educational question.";
      }

      console.warn(`[EduAI] Gemini ${model} returned unexpected shape:`, JSON.stringify(data).slice(0, 300));
      lastError = `Gemini ${model} returned unexpected response format`;
      continue;

    } catch (e: any) {
      if (e.name === 'AbortError' || e.name === 'TimeoutError') {
        console.warn(`[EduAI] Gemini ${model} request timed out`);
        lastError = `Gemini ${model} timed out after 15s`;
        continue;
      }
      // Re-throw auth errors immediately
      if (e.message?.includes('error 400') || e.message?.includes('error 403')) {
        throw e;
      }
      console.warn(`[EduAI] Gemini ${model} fetch error:`, e.message);
      lastError = e.message || 'Unknown fetch error';
      continue;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError}`);
}

/**
 * Main entry point — calls Gemini (preferred) or OpenAI (fallback).
 * Includes comprehensive error handling so the chatbot never silently fails.
 */
export async function callTutorAI(req: TutorRequest): Promise<TutorResponse> {
  const systemPrompt = getSystemPrompt(req.language);

  // ── 1. Try Gemini (preferred) ──
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const reply = await callGeminiAPI(
        req.prompt,
        systemPrompt,
        geminiKey,
        process.env.GEMINI_MODEL || undefined
      );
      return { reply, reasoning: undefined };
    } catch (e: any) {
      console.error(`[EduAI] Gemini pipeline failed:`, e.message);
      // Fall through to OpenAI if available
    }
  }

  // ── 2. Try OpenAI (fallback) ──
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: req.prompt }
          ],
          temperature: 0.3,
          max_tokens: 1024
        }),
        signal: AbortSignal.timeout(20000)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenAI API error ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content ?? '';
      return { reply, reasoning: undefined };
    } catch (e: any) {
      console.error(`[EduAI] OpenAI pipeline failed:`, e.message);
    }
  }

  // ── 3. No API key at all — return a helpful error ──
  if (!geminiKey && !openaiKey) {
    throw new Error(
      'No AI API key configured. Add GEMINI_API_KEY or OPENAI_API_KEY to your .env.local file.'
    );
  }

  // ── 4. Both APIs failed — throw with context ──
  throw new Error(
    'AI service is temporarily unavailable. Both Gemini and OpenAI failed to respond. Please try again in a moment.'
  );
}
