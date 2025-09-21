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
exports.ArticleService = void 0;
const article_model_1 = require("./article.model");
const createArticle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // Validate content length before creating
    if (((_a = payload.content) === null || _a === void 0 ? void 0 : _a.html) && payload.content.html.length > 10000000) {
        throw new Error("HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_b = payload.content) === null || _b === void 0 ? void 0 : _b.plainText) && payload.content.plainText.length > 5000000) {
        throw new Error("Plain text content is too long. Maximum allowed length is 5MB.");
    }
    // Validate dual-language content length
    if (((_e = (_d = (_c = payload.dualLanguage) === null || _c === void 0 ? void 0 : _c.en) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.html) && payload.dualLanguage.en.content.html.length > 10000000) {
        throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_h = (_g = (_f = payload.dualLanguage) === null || _f === void 0 ? void 0 : _f.en) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.plainText) && payload.dualLanguage.en.content.plainText.length > 5000000) {
        throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
    }
    if (((_l = (_k = (_j = payload.dualLanguage) === null || _j === void 0 ? void 0 : _j.ar) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.html) && payload.dualLanguage.ar.content.html.length > 10000000) {
        throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_p = (_o = (_m = payload.dualLanguage) === null || _m === void 0 ? void 0 : _m.ar) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.plainText) && payload.dualLanguage.ar.content.plainText.length > 5000000) {
        throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
    }
    const article = yield article_model_1.Article.create(payload);
    return article;
});
const getArticleBySlug = (slug, language) => __awaiter(void 0, void 0, void 0, function* () {
    return article_model_1.Article.findOne({ slug, language });
});
const listArticles = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const [items, total] = yield Promise.all([
        article_model_1.Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        article_model_1.Article.countDocuments(filter)
    ]);
    return { items, total, page, limit };
});
const updateArticle = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // Validate content length before updating
    if (((_a = payload.content) === null || _a === void 0 ? void 0 : _a.html) && payload.content.html.length > 10000000) {
        throw new Error("HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_b = payload.content) === null || _b === void 0 ? void 0 : _b.plainText) && payload.content.plainText.length > 5000000) {
        throw new Error("Plain text content is too long. Maximum allowed length is 5MB.");
    }
    // Validate dual-language content length
    if (((_e = (_d = (_c = payload.dualLanguage) === null || _c === void 0 ? void 0 : _c.en) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.html) && payload.dualLanguage.en.content.html.length > 10000000) {
        throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_h = (_g = (_f = payload.dualLanguage) === null || _f === void 0 ? void 0 : _f.en) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.plainText) && payload.dualLanguage.en.content.plainText.length > 5000000) {
        throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
    }
    if (((_l = (_k = (_j = payload.dualLanguage) === null || _j === void 0 ? void 0 : _j.ar) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.html) && payload.dualLanguage.ar.content.html.length > 10000000) {
        throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_p = (_o = (_m = payload.dualLanguage) === null || _m === void 0 ? void 0 : _m.ar) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.plainText) && payload.dualLanguage.ar.content.plainText.length > 5000000) {
        throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
    }
    return article_model_1.Article.findByIdAndUpdate(id, payload, { new: true });
});
const deleteArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return article_model_1.Article.findByIdAndDelete(id);
});
const upsertTranslationMeta = (articleId, targetLanguage, meta) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const article = yield article_model_1.Article.findById(articleId);
    if (!article)
        return null;
    const translations = (_a = article.translations) !== null && _a !== void 0 ? _a : new Map();
    const existing = translations.get(targetLanguage);
    const next = {
        articleId: article._id,
        status: (_b = existing === null || existing === void 0 ? void 0 : existing.status) !== null && _b !== void 0 ? _b : "draft",
        lastTranslatedAt: new Date(),
        translationProvider: meta && meta.translationProvider
    };
    translations.set(targetLanguage, next);
    article.translations = translations;
    yield article.save();
    return article;
});
// New methods for dual-language support
const getArticleBySlugDualLanguage = (slug, language) => __awaiter(void 0, void 0, void 0, function* () {
    // First try to find by slug and language (existing behavior)
    let article = yield article_model_1.Article.findOne({ slug, language });
    // If not found, try to find by slug and check dual-language content
    if (!article) {
        article = yield article_model_1.Article.findOne({
            slug,
            [`dualLanguage.${language}.status`]: { $exists: true }
        });
    }
    return article;
});
const createDualLanguageArticle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // Validate that both languages have content
    if (!((_a = payload.dualLanguage) === null || _a === void 0 ? void 0 : _a.en) && !((_b = payload.dualLanguage) === null || _b === void 0 ? void 0 : _b.ar)) {
        throw new Error("At least one language (English or Arabic) must be provided in dualLanguage content.");
    }
    // Validate content length for dual-language content
    if (((_e = (_d = (_c = payload.dualLanguage) === null || _c === void 0 ? void 0 : _c.en) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.html) && payload.dualLanguage.en.content.html.length > 10000000) {
        throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_h = (_g = (_f = payload.dualLanguage) === null || _f === void 0 ? void 0 : _f.en) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.plainText) && payload.dualLanguage.en.content.plainText.length > 5000000) {
        throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
    }
    if (((_l = (_k = (_j = payload.dualLanguage) === null || _j === void 0 ? void 0 : _j.ar) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.html) && payload.dualLanguage.ar.content.html.length > 10000000) {
        throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_p = (_o = (_m = payload.dualLanguage) === null || _m === void 0 ? void 0 : _m.ar) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.plainText) && payload.dualLanguage.ar.content.plainText.length > 5000000) {
        throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
    }
    const article = yield article_model_1.Article.create(payload);
    return article;
});
const updateDualLanguageArticle = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // Validate content length for dual-language content
    if (((_c = (_b = (_a = payload.dualLanguage) === null || _a === void 0 ? void 0 : _a.en) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.html) && payload.dualLanguage.en.content.html.length > 10000000) {
        throw new Error("English HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_f = (_e = (_d = payload.dualLanguage) === null || _d === void 0 ? void 0 : _d.en) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.plainText) && payload.dualLanguage.en.content.plainText.length > 5000000) {
        throw new Error("English plain text content is too long. Maximum allowed length is 5MB.");
    }
    if (((_j = (_h = (_g = payload.dualLanguage) === null || _g === void 0 ? void 0 : _g.ar) === null || _h === void 0 ? void 0 : _h.content) === null || _j === void 0 ? void 0 : _j.html) && payload.dualLanguage.ar.content.html.length > 10000000) {
        throw new Error("Arabic HTML content is too long. Maximum allowed length is 10MB.");
    }
    if (((_m = (_l = (_k = payload.dualLanguage) === null || _k === void 0 ? void 0 : _k.ar) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.plainText) && payload.dualLanguage.ar.content.plainText.length > 5000000) {
        throw new Error("Arabic plain text content is too long. Maximum allowed length is 5MB.");
    }
    return article_model_1.Article.findByIdAndUpdate(id, payload, { new: true });
});
const addArabicVersionToExistingArticle = (id, arabicContent) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield article_model_1.Article.findById(id);
    if (!article) {
        throw new Error("Article not found");
    }
    // Initialize dualLanguage if it doesn't exist
    if (!article.dualLanguage) {
        article.dualLanguage = {};
    }
    // Add Arabic content
    article.dualLanguage.ar = Object.assign(Object.assign(Object.assign({}, article.dualLanguage.ar), arabicContent), { status: arabicContent.status || "draft" });
    yield article.save();
    return article;
});
// New method to add Arabic author, title, subtitle to existing article
const addArabicAuthorTitleSubtitle = (id, arabicFields) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield article_model_1.Article.findById(id);
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
    yield article.save();
    return article;
});
// Method to update dual-language author, title, subtitle
const updateDualLanguageFields = (id, fields) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield article_model_1.Article.findById(id);
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
    yield article.save();
    return article;
});
exports.ArticleService = {
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
