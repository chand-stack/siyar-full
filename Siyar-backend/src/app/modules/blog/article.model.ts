import { model, Schema } from "mongoose";
import { ArticleStatus, IArticle, IArticleTranslationMeta, SupportedLanguage } from "./article.interface";
import { estimateReadingTimeInMinutes } from "./readingTime.util";

const TranslationMetaSchema = new Schema<IArticleTranslationMeta>({
	articleId: { type: Schema.Types.ObjectId, ref: "Article" },
	status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
	lastTranslatedAt: { type: Date, default: Date.now },
	translationProvider: { type: String }
}, { _id: false, versionKey: false });

const ArticleSchema = new Schema<IArticle>({
	slug: { type: String, required: true },
	language: { type: String, required: true, enum: ["en", "ar", "id", "tr"], default: "en" },
	title: { type: String, required: true },
	subtitle: { type: String },
	excerpt: { type: String },
	author: { type: String, required: true },
	readTime: { type: String },
	// Support for dual-language author, title, subtitle
	dualLanguageAuthor: {
		en: { type: String },
		ar: { type: String }
	},
	dualLanguageTitle: {
		en: { type: String },
		ar: { type: String }
	},
	dualLanguageSubtitle: {
		en: { type: String },
		ar: { type: String }
	},
	content: {
		html: { type: String, required: true, maxlength: 10000000 }, // ~10MB max for HTML content
		plainText: { type: String, maxlength: 5000000 }, // ~5MB max for plain text
		wordCount: { type: Number, default: 0 }
	},
	featuredImage: {
		url: { type: String, required: true },
		alt: { type: String },
		caption: { type: String }
	},
	categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
	series: {
		id: { type: Schema.Types.ObjectId, ref: "Series" },
		order: { type: Number, default: 0 }
	},
	meta: {
		description: { type: String },
		keywords: [{ type: String }],
		ogImage: { type: String }
	},
	// Support for dual-language content
	dualLanguage: {
		en: {
			title: { type: String },
			subtitle: { type: String },
			excerpt: { type: String },
			content: {
				html: { type: String, maxlength: 10000000 },
				plainText: { type: String, maxlength: 5000000 },
				wordCount: { type: Number, default: 0 }
			},
			featuredImage: {
				url: { type: String },
				alt: { type: String },
				caption: { type: String }
			},
			meta: {
				description: { type: String },
				keywords: [{ type: String }],
				ogImage: { type: String }
			},
			readTime: { type: String },
			status: { type: String, enum: ["draft", "published", "archived"], default: "draft" }
		},
		ar: {
			title: { type: String },
			subtitle: { type: String },
			excerpt: { type: String },
			content: {
				html: { type: String, maxlength: 10000000 },
				plainText: { type: String, maxlength: 5000000 },
				wordCount: { type: Number, default: 0 }
			},
			featuredImage: {
				url: { type: String },
				alt: { type: String },
				caption: { type: String }
			},
			meta: {
				description: { type: String },
				keywords: [{ type: String }],
				ogImage: { type: String }
			},
			readTime: { type: String },
			status: { type: String, enum: ["draft", "published", "archived"], default: "draft" }
		}
	},
	translations: {
		type: Map,
		of: TranslationMetaSchema as unknown as Schema<IArticleTranslationMeta>
	},
	status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
	isFeatured: { type: Boolean, default: false },
	isLatest: { type: Boolean, default: false },
	stats: {
		views: { type: Number, default: 0 },
		shares: { type: Number, default: 0 },
		readingTime: { type: Number, default: 0 }
	}
}, {
	timestamps: true,
	collection: "articles",
	versionKey: false
});

// Pre-save hook to update content.wordCount and stats.readingTime if plainText present
ArticleSchema.pre("save", function (next) {
	try {
		// Check content length limits for main content
		if (this.content?.html && this.content.html.length > 10000000) {
			return next(new Error("HTML content is too long. Maximum allowed length is 10MB."));
		}
		if (this.content?.plainText && this.content.plainText.length > 5000000) {
			return next(new Error("Plain text content is too long. Maximum allowed length is 5MB."));
		}

		// Check content length limits for dual-language content
		if (this.dualLanguage?.en?.content?.html && this.dualLanguage.en.content.html.length > 10000000) {
			return next(new Error("English HTML content is too long. Maximum allowed length is 10MB."));
		}
		if (this.dualLanguage?.en?.content?.plainText && this.dualLanguage.en.content.plainText.length > 5000000) {
			return next(new Error("English plain text content is too long. Maximum allowed length is 5MB."));
		}
		if (this.dualLanguage?.ar?.content?.html && this.dualLanguage.ar.content.html.length > 10000000) {
			return next(new Error("Arabic HTML content is too long. Maximum allowed length is 10MB."));
		}
		if (this.dualLanguage?.ar?.content?.plainText && this.dualLanguage.ar.content.plainText.length > 5000000) {
			return next(new Error("Arabic plain text content is too long. Maximum allowed length is 5MB."));
		}

		// Handle dual-language author, title, subtitle - ensure backward compatibility
		if (this.isModified("dualLanguageAuthor") || this.isNew) {
			// If dualLanguageAuthor is provided, use it; otherwise keep existing author
			if (this.dualLanguageAuthor?.en && !this.author) {
				this.author = this.dualLanguageAuthor.en;
			}
		}

		if (this.isModified("dualLanguageTitle") || this.isNew) {
			// If dualLanguageTitle is provided, use it; otherwise keep existing title
			if (this.dualLanguageTitle?.en && !this.title) {
				this.title = this.dualLanguageTitle.en;
			}
		}

		if (this.isModified("dualLanguageSubtitle") || this.isNew) {
			// If dualLanguageSubtitle is provided, use it; otherwise keep existing subtitle
			if (this.dualLanguageSubtitle?.en && !this.subtitle) {
				this.subtitle = this.dualLanguageSubtitle.en;
			}
		}

		// Update word count and reading time for main content
		if (this.isModified("content.plainText") || this.isNew) {
			const plain = this.content?.plainText ?? "";
			const words = plain.trim().length ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
			this.content.wordCount = words;
			const minutes = estimateReadingTimeInMinutes(plain);
			this.stats.readingTime = minutes;
		}

		// Update word count and reading time for dual-language content
		if (this.isModified("dualLanguage.en.content.plainText") || this.isNew) {
			const plain = this.dualLanguage?.en?.content?.plainText ?? "";
			const words = plain.trim().length ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
			if (this.dualLanguage?.en?.content) {
				this.dualLanguage.en.content.wordCount = words;
			}
		}

		if (this.isModified("dualLanguage.ar.content.plainText") || this.isNew) {
			const plain = this.dualLanguage?.ar?.content?.plainText ?? "";
			const words = plain.trim().length ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
			if (this.dualLanguage?.ar?.content) {
				this.dualLanguage.ar.content.wordCount = words;
			}
		}

		next();
	} catch (e) {
		next(e as any);
	}
});

// Indexes for performance
ArticleSchema.index({ slug: 1, language: 1 }, { unique: true });
ArticleSchema.index({ language: 1, status: 1 });
ArticleSchema.index({ language: 1, isFeatured: 1 });
ArticleSchema.index({ language: 1, isLatest: 1, createdAt: -1 });
ArticleSchema.index({ categories: 1, language: 1 });
ArticleSchema.index({ "series.id": 1, language: 1 });
ArticleSchema.index({ "translations.articleId": 1 });
// Indexes for dual-language support
ArticleSchema.index({ "dualLanguage.en.status": 1 });
ArticleSchema.index({ "dualLanguage.ar.status": 1 });
ArticleSchema.index({ slug: 1, "dualLanguage.en.status": 1 });
ArticleSchema.index({ slug: 1, "dualLanguage.ar.status": 1 });
// Indexes for dual-language author, title, subtitle
ArticleSchema.index({ "dualLanguageAuthor.en": 1 });
ArticleSchema.index({ "dualLanguageAuthor.ar": 1 });
ArticleSchema.index({ "dualLanguageTitle.en": 1 });
ArticleSchema.index({ "dualLanguageTitle.ar": 1 });

export const Article = model<IArticle>("Article", ArticleSchema);


