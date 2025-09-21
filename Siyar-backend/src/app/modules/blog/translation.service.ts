import { Article } from "./article.model";
import { SupportedLanguage } from "./article.interface";
import { translateHtmlWithOpenAI, translateTextWithOpenAI } from "./ai.provider";

// Placeholder translation function using a provider token from env when available.
// Integrate with your preferred provider (e.g., OpenAI, Google, DeepL) here.
async function translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
	return translateHtmlWithOpenAI(text, targetLanguage);
}

export const translateArticle = async (articleId: string, targetLanguage: SupportedLanguage) => {
	const article = await Article.findById(articleId);
	if (!article) return null;
	if (article.language === targetLanguage) return article;

	const translatedHtml = await translateText(article.content.html, targetLanguage);

	// Create or update a translated article as a separate document with same slug and new language.
	const translated = await Article.findOneAndUpdate(
		{ slug: article.slug, language: targetLanguage },
		{
			slug: article.slug,
			language: targetLanguage,
			title: article.title,
			subtitle: article.subtitle,
			excerpt: article.excerpt,
			author: article.author,
			readTime: article.readTime,
			content: {
				html: translatedHtml,
				plainText: article.content.plainText,
				wordCount: article.content.wordCount
			},
			featuredImage: article.featuredImage,
			categories: article.categories,
			series: article.series,
			meta: article.meta,
			status: "draft",
			isFeatured: article.isFeatured,
			isLatest: article.isLatest,
			stats: article.stats
		},
		{ new: true, upsert: true }
	);

	return translated;
};

export const previewTranslation = async (articleId: string, targetLanguage: SupportedLanguage) => {
	const article = await Article.findById(articleId);
	if (!article) return null;
	if (targetLanguage === "en") {
		return {
			language: "en",
			title: article.title,
			subtitle: article.subtitle,
			excerpt: article.excerpt,
			html: article.content.html
		};
	}
	const [title, subtitle, excerpt, html] = await Promise.all([
		translateTextWithOpenAI(article.title, targetLanguage),
		article.subtitle ? translateTextWithOpenAI(article.subtitle, targetLanguage) : Promise.resolve(undefined),
		article.excerpt ? translateTextWithOpenAI(article.excerpt, targetLanguage) : Promise.resolve(undefined),
		translateHtmlWithOpenAI(article.content.html, targetLanguage)
	]);
	return { language: targetLanguage, title, subtitle, excerpt, html };
};


