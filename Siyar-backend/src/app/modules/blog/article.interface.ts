import { Document, Types } from "mongoose";

export type SupportedLanguage = "en" | "ar" | "id" | "tr";

export interface IArticleContent {
	html: string;
	plainText?: string;
	wordCount: number;
}

export interface IArticleImage {
	url: string;
	alt: string;
	caption?: string;
}

export interface IArticleSeriesRef {
	id: Types.ObjectId;
	order: number;
}

export interface IArticleMeta {
	description: string;
	keywords: string[];
	ogImage?: string;
}

export type TranslationStatus = "draft" | "published" | "archived";

export interface IArticleTranslationMeta {
	articleId: Types.ObjectId;
	status: TranslationStatus;
	lastTranslatedAt: Date;
	translationProvider?: string;
}

export interface IArticleStats {
	views: number;
	shares: number;
	readingTime: number;
}

export type ArticleStatus = "draft" | "published" | "archived";

export interface IDualLanguageContent {
	title?: string;
	subtitle?: string;
	excerpt?: string;
	content?: IArticleContent;
	featuredImage?: IArticleImage;
	meta?: IArticleMeta;
	readTime?: string;
	status?: ArticleStatus;
}

export interface IDualLanguageArticle {
	en?: IDualLanguageContent;
	ar?: IDualLanguageContent;
}

export interface IDualLanguageFields {
	en?: string;
	ar?: string;
}

export interface IArticle extends Document {
	slug: string;
	language: SupportedLanguage;
	title: string;
	subtitle?: string;
	excerpt?: string;
	/**
	 * Only one admin posts, so we keep author as a string (e.g., name or identifier).
	 */
	author: string;
	publishedAt: Date;
	updatedAt: Date;
	readTime: string;
	content: IArticleContent;
	featuredImage: IArticleImage;
	categories?: Types.ObjectId[];
	series?: IArticleSeriesRef;
	meta: IArticleMeta;
	// Support for dual-language content
	dualLanguage?: IDualLanguageArticle;
	// Support for dual-language author, title, subtitle
	dualLanguageAuthor?: IDualLanguageFields;
	dualLanguageTitle?: IDualLanguageFields;
	dualLanguageSubtitle?: IDualLanguageFields;
	translations?: Map<SupportedLanguage, IArticleTranslationMeta>;
	status: ArticleStatus;
	isFeatured: boolean;
	isLatest: boolean;
	stats: IArticleStats;
}


