import OpenAI from "openai";
import { SupportedLanguage } from "./article.interface";

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

const languageNameMap: Record<SupportedLanguage, string> = {
	en: "English",
	ar: "Arabic",
	id: "Bahasa Indonesia",
	tr: "Turkish"
};

export async function translateHtmlWithOpenAI(html: string, targetLanguage: SupportedLanguage): Promise<string> {
	if (!openai) {
		return html;
	}
	const targetName = languageNameMap[targetLanguage] ?? targetLanguage;
	const system = `You are a professional translator. Translate the user's HTML content into ${targetName}.\n- Preserve all HTML tags and structure.\n- Only translate human-readable text.\n- Do not add explanations. Return only the translated HTML.`;
	const user = html;
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: user }
		],
		temperature: 0.2,
	});
	const content = response.choices?.[0]?.message?.content ?? html;
	return content;
}

export async function translateTextWithOpenAI(text: string, targetLanguage: SupportedLanguage): Promise<string> {
	if (!openai) {
		return text;
	}
	const targetName = languageNameMap[targetLanguage] ?? targetLanguage;
	const system = `You are a professional translator. Translate the user's text into ${targetName}. Return only the translated text.`;
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: text }
		],
		temperature: 0.2,
	});
	const content = response.choices?.[0]?.message?.content ?? text;
	return content;
}


