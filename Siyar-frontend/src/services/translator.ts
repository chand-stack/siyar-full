// Client-side translation via OpenAI Responses API
// NOTE: For production, move this to a server. Keys must never be shipped to the client.

type TranslateArgs = {
  html: string;
  from: string; // 'en'
  to: string;   // 'ar' | 'en' | 'id' | 'tr'
};

export async function translateHtml({ html, from, to }: TranslateArgs): Promise<string> {
  // If same language, return as-is
  if (from === to) return html;

  // If a server endpoint exists, prefer it. Env flag toggles.
  const endpoint = import.meta.env.VITE_TRANSLATE_ENDPOINT as string | undefined;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, from, to }),
    });
    if (!res.ok) throw new Error('Translation service failed');
    const data = (await res.json()) as { html: string };
    return data.html;
  }
  // Fallback: try LibreTranslate public endpoint (best-effort, rate-limited)
  try {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ q: html, source: from, target: to, format: 'html' }),
    });
    if (res.ok) {
      const data = (await res.json()) as { translatedText?: string };
      if (data.translatedText) return data.translatedText;
    }
  } catch (_) {
    // ignore and fall back
  }

  // Final fallback: return original content to avoid breaking UX
  return html;
}


