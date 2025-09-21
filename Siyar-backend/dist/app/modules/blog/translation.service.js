"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewTranslation = exports.translateArticle = void 0;
const article_model_1 = require("./article.model");
const ai_provider_1 = require("./ai.provider");
// Placeholder translation function using a provider token from env when available.
// Integrate with your preferred provider (e.g., OpenAI, Google, DeepL) here.
function translateText(text, targetLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, ai_provider_1.translateHtmlWithOpenAI)(text, targetLanguage);
    });
}
const translateArticle = (articleId, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield article_model_1.Article.findById(articleId);
    if (!article)
        return null;
    if (article.language === targetLanguage)
        return article;
    const translatedHtml = yield translateText(article.content.html, targetLanguage);
    // Create or update a translated article as a separate document with same slug and new language.
    const translated = yield article_model_1.Article.findOneAndUpdate({ slug: article.slug, language: targetLanguage }, {
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
    }, { new: true, upsert: true });
    return translated;
});
exports.translateArticle = translateArticle;
const previewTranslation = (articleId, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield article_model_1.Article.findById(articleId);
    if (!article)
        return null;
    if (targetLanguage === "en") {
        return {
            language: "en",
            title: article.title,
            subtitle: article.subtitle,
            excerpt: article.excerpt,
            html: article.content.html
        };
    }
    const [title, subtitle, excerpt, html] = yield Promise.all([
        (0, ai_provider_1.translateTextWithOpenAI)(article.title, targetLanguage),
        article.subtitle ? (0, ai_provider_1.translateTextWithOpenAI)(article.subtitle, targetLanguage) : Promise.resolve(undefined),
        article.excerpt ? (0, ai_provider_1.translateTextWithOpenAI)(article.excerpt, targetLanguage) : Promise.resolve(undefined),
        (0, ai_provider_1.translateHtmlWithOpenAI)(article.content.html, targetLanguage)
    ]);
    return { language: targetLanguage, title, subtitle, excerpt, html };
});
exports.previewTranslation = previewTranslation;
