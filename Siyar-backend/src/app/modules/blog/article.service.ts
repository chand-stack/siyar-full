import { FilterQuery, Types } from "mongoose";
import { Article } from "./article.model";
import { IArticle, SupportedLanguage } from "./article.interface";

const createArticle = async (payload: Partial<IArticle>) => {
	// Validate content length before creating
	if (payload.content?.html && payload.content.html.length > 10000000) {
		throw new Error("HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.content?.plainText && payload.content.plainText.length > 5000000) {
		throw new Error("Plain text content is too long. Maximum allowed length is 5MB.");
	}

	// Validate dual-language content length
	if (payload.dualLanguage?.en?.content?.html && payload.dualLanguage.en.content.html.length > 10000000) {
		throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.en?.content?.plainText && payload.dualLanguage.en.content.plainText.length > 5000000) {
		throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
	}
	if (payload.dualLanguage?.ar?.content?.html && payload.dualLanguage.ar.content.html.length > 10000000) {
		throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.ar?.content?.plainText && payload.dualLanguage.ar.content.plainText.length > 5000000) {
		throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
	}

	const article = await Article.create(payload);
	return article;
};

const getArticleBySlug = async (slug: string, language: SupportedLanguage) => {
	return Article.findOne({ slug, language });
};

const listArticles = async (filter: FilterQuery<IArticle> = {}, limit = 20, page = 1) => {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
		Article.countDocuments(filter)
	]);
	return { items, total, page, limit };
};

const updateArticle = async (id: string, payload: Partial<IArticle>) => {
	// Validate content length before updating
	if (payload.content?.html && payload.content.html.length > 10000000) {
		throw new Error("HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.content?.plainText && payload.content.plainText.length > 5000000) {
		throw new Error("Plain text content is too long. Maximum allowed length is 5MB.");
	}

	// Validate dual-language content length
	if (payload.dualLanguage?.en?.content?.html && payload.dualLanguage.en.content.html.length > 10000000) {
		throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.en?.content?.plainText && payload.dualLanguage.en.content.plainText.length > 5000000) {
		throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
	}
	if (payload.dualLanguage?.ar?.content?.html && payload.dualLanguage.ar.content.html.length > 10000000) {
		throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.ar?.content?.plainText && payload.dualLanguage.ar.content.plainText.length > 5000000) {
		throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
	}

	return Article.findByIdAndUpdate(id, payload, { new: true });
};

const deleteArticle = async (id: string) => {
	return Article.findByIdAndDelete(id);
};

const upsertTranslationMeta = async (
	articleId: string,
	targetLanguage: SupportedLanguage,
	meta: Partial<IArticle["translations"] extends Map<infer L, infer M> ? M : never>
) => {
	const article = await Article.findById(articleId);
	if (!article) return null;
	const translations = article.translations ?? new Map();
	const existing = translations.get(targetLanguage);
	const next = {
		articleId: article._id as Types.ObjectId,
		status: existing?.status ?? "draft",
		lastTranslatedAt: new Date(),
		translationProvider: meta && (meta as any).translationProvider
	} as any;
	translations.set(targetLanguage, next);
	article.translations = translations as any;
	await article.save();
	return article;
};

// New methods for dual-language support
const getArticleBySlugDualLanguage = async (slug: string, language: SupportedLanguage) => {
	// First try to find by slug and language (existing behavior)
	let article = await Article.findOne({ slug, language });
	
	// If not found, try to find by slug and check dual-language content
	if (!article) {
		article = await Article.findOne({ 
			slug,
			[`dualLanguage.${language}.status`]: { $exists: true }
		});
	}
	
	return article;
};

const createDualLanguageArticle = async (payload: Partial<IArticle>) => {
	// Validate that both languages have content
	if (!payload.dualLanguage?.en && !payload.dualLanguage?.ar) {
		throw new Error("At least one language (English or Arabic) must be provided in dualLanguage content.");
	}

	// Validate content length for dual-language content
	if (payload.dualLanguage?.en?.content?.html && payload.dualLanguage.en.content.html.length > 10000000) {
		throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.en?.content?.plainText && payload.dualLanguage.en.content.plainText.length > 5000000) {
		throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
	}
	if (payload.dualLanguage?.ar?.content?.html && payload.dualLanguage.ar.content.html.length > 10000000) {
		throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.ar?.content?.plainText && payload.dualLanguage.ar.content.plainText.length > 5000000) {
		throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
	}

	const article = await Article.create(payload);
	return article;
};

const updateDualLanguageArticle = async (id: string, payload: Partial<IArticle>) => {
	// Validate content length for dual-language content
	if (payload.dualLanguage?.en?.content?.html && payload.dualLanguage.en.content.html.length > 10000000) {
		throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.en?.content?.plainText && payload.dualLanguage.en.content.plainText.length > 5000000) {
		throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
	}
	if (payload.dualLanguage?.ar?.content?.html && payload.dualLanguage.ar.content.html.length > 10000000) {
		throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
	}
	if (payload.dualLanguage?.ar?.content?.plainText && payload.dualLanguage.ar.content.plainText.length > 5000000) {
		throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
	}

	return Article.findByIdAndUpdate(id, payload, { new: true });
};

const addArabicVersionToExistingArticle = async (id: string, arabicContent: any) => {
	const article = await Article.findById(id);
	if (!article) {
		throw new Error("Article not found");
	}

	// Initialize dualLanguage if it doesn't exist
	if (!article.dualLanguage) {
		article.dualLanguage = {};
	}

	// Add Arabic content
	article.dualLanguage.ar = {
		...article.dualLanguage.ar,
		...arabicContent,
		status: arabicContent.status || "draft"
	} as any;

	await article.save();
	return article;
};

// New method to add Arabic author, title, subtitle to existing article
const addArabicAuthorTitleSubtitle = async (id: string, arabicFields: any) => {
	const article = await Article.findById(id);
	if (!article) {
		throw new Error("Article not found");
	}

	// Initialize dual-language fields if they don't exist
	if (!article.dualLanguageAuthor) {
		article.dualLanguageAuthor = {};
	}
	if (!article.dualLanguageTitle) {
		article.dualLanguageTitle = {};
	}
	if (!article.dualLanguageSubtitle) {
		article.dualLanguageSubtitle = {};
	}

	// Add Arabic author, title, subtitle
	if (arabicFields.author) {
		article.dualLanguageAuthor.ar = arabicFields.author;
	}
	if (arabicFields.title) {
		article.dualLanguageTitle.ar = arabicFields.title;
	}
	if (arabicFields.subtitle) {
		article.dualLanguageSubtitle.ar = arabicFields.subtitle;
	}

	await article.save();
	return article;
};

// Method to update dual-language author, title, subtitle
const updateDualLanguageFields = async (id: string, fields: any) => {
	const article = await Article.findById(id);
	if (!article) {
		throw new Error("Article not found");
	}

	// Update dual-language author
	if (fields.dualLanguageAuthor) {
		if (!article.dualLanguageAuthor) {
			article.dualLanguageAuthor = {};
		}
		if (fields.dualLanguageAuthor.en) {
			article.dualLanguageAuthor.en = fields.dualLanguageAuthor.en;
		}
		if (fields.dualLanguageAuthor.ar) {
			article.dualLanguageAuthor.ar = fields.dualLanguageAuthor.ar;
		}
	}

	// Update dual-language title
	if (fields.dualLanguageTitle) {
		if (!article.dualLanguageTitle) {
			article.dualLanguageTitle = {};
		}
		if (fields.dualLanguageTitle.en) {
			article.dualLanguageTitle.en = fields.dualLanguageTitle.en;
		}
		if (fields.dualLanguageTitle.ar) {
			article.dualLanguageTitle.ar = fields.dualLanguageTitle.ar;
		}
	}

	// Update dual-language subtitle
	if (fields.dualLanguageSubtitle) {
		if (!article.dualLanguageSubtitle) {
			article.dualLanguageSubtitle = {};
		}
		if (fields.dualLanguageSubtitle.en) {
			article.dualLanguageSubtitle.en = fields.dualLanguageSubtitle.en;
		}
		if (fields.dualLanguageSubtitle.ar) {
			article.dualLanguageSubtitle.ar = fields.dualLanguageSubtitle.ar;
		}
	}

	await article.save();
	return article;
};

export const ArticleService = {
	createArticle,
	getArticleBySlug,
	listArticles,
	updateArticle,
	deleteArticle,
	upsertTranslationMeta,
	// New dual-language methods
	getArticleBySlugDualLanguage,
	createDualLanguageArticle,
	updateDualLanguageArticle,
	addArabicVersionToExistingArticle,
	// New dual-language author, title, subtitle methods
	addArabicAuthorTitleSubtitle,
	updateDualLanguageFields
};


