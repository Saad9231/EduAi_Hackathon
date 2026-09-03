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
 * Call OpenAI's Chat Completions API using the server-side API key.
 * Requires `OPENAI_API_KEY` to be set in server environment (e.g. .env.local).
 */
export async function callTutorAI(req: TutorRequest): Promise<TutorResponse> {
  // Prefer Gemini if configured (user provides GEMINI_API_KEY + GEMINI_API_URL)
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiUrl = process.env.GEMINI_API_URL;
  const geminiModel = process.env.GEMINI_MODEL;
  const geminiProvider = process.env.GEMINI_PROVIDER || 'generic';
  const geminiBearer = process.env.GEMINI_BEARER_TOKEN;

  if (geminiKey || geminiBearer || geminiUrl) {
    // Support Google Generative API (Gemini) when GEMINI_PROVIDER=google
    if (geminiProvider === 'google') {
      const model = geminiModel || 'chat-bison@001';
      const base = geminiUrl || `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generate`;

      // Google Generative API expects a `prompt` object. Use `text` for simple cases.
      const body: any = {
        prompt: { text: req.prompt },
        temperature: 0.2,
        maxOutputTokens: 800
      };

      const headers: any = { 'Content-Type': 'application/json' };
      if (geminiBearer) headers.Authorization = `Bearer ${geminiBearer}`;

      // If only GEMINI_API_KEY is provided, include it as query param
      const url = geminiBearer ? base : (base + (base.includes('?') ? '&' : '?') + `key=${encodeURIComponent(geminiKey || '')}`);

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini (Google) API error ${res.status}: ${text}`);
      }

      const data = await res.json();

      // Robust extraction for Google Gen AI response shapes.
      // Possible shapes:
      // - data.candidates[0].output[0].content[{text: '...'}]
      // - data.candidates[0].content[0].text
      // - data.output[0].content[0].text
      let reply = '';

      try {
        const cand = data?.candidates?.[0];
        if (cand) {
          // candidate.output -> array of outputs
          if (cand.output) {
            // output may contain content array
            const out0 = cand.output[0];
            if (out0?.content) {
              // find text blocks
              const texts = out0.content.filter((c: any) => c.type === 'text' && c.text).map((c: any) => c.text);
              if (texts.length) reply = texts.join('\n');
            }
          }

          // fallback to candidate.content
          if (!reply && cand.content && cand.content[0]?.text) {
            reply = cand.content[0].text;
          }
        }

        // other shapes
        if (!reply && data?.output && data.output[0]?.content) {
          const texts = data.output[0].content.filter((c: any) => c.type === 'text' && c.text).map((c: any) => c.text);
          if (texts.length) reply = texts.join('\n');
        }

        if (!reply && data?.candidates?.[0]?.content?.[0]?.text) reply = data.candidates[0].content[0].text;
        if (!reply && data?.candidates?.[0]?.output?.[0]) reply = JSON.stringify(data.candidates[0].output[0]);
        if (!reply && data?.content) reply = String(data.content);
        if (!reply) reply = JSON.stringify(data);
      } catch (e) {
        reply = JSON.stringify(data);
      }

      return { reply: String(reply), reasoning: undefined };
    }

    // Generic POST to a user-provided Gemini-compatible endpoint.
    if (geminiUrl) {
      const body: any = { prompt: req.prompt };
      if (geminiModel) body.model = geminiModel;

      const headers: any = { 'Content-Type': 'application/json' };
      if (geminiBearer) headers.Authorization = `Bearer ${geminiBearer}`;
      else if (geminiKey) headers.Authorization = `Bearer ${geminiKey}`;

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${text}`);
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content ?? data?.output?.[0]?.content ?? data?.content ?? data?.response ?? JSON.stringify(data);
      return { reply, reasoning: undefined };
    }
  }

  // Fallback: OpenAI
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('Missing server-side OPENAI_API_KEY environment variable and no Gemini config found');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  const systemPrompt = `You are an educational tutor assistant. Provide clear, concise step-by-step explanations and a friendly tone. If the user language is UR, prefer Urdu responses when requested.`;

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: req.prompt }
    ],
    temperature: 0.2,
    max_tokens: 800
  } as any;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content ?? '';

  return { reply, reasoning: undefined };
}
