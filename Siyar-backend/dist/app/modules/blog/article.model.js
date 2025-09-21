"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = require("mongoose");
const readingTime_util_1 = require("./readingTime.util");
const TranslationMetaSchema = new mongoose_1.Schema({
    articleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Article" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    lastTranslatedAt: { type: Date, default: Date.now },
    translationProvider: { type: String }
}, { _id: false, versionKey: false });
const ArticleSchema = new mongoose_1.Schema({
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
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Category" }],
    series: {
        id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Series" },
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
        of: TranslationMetaSchema
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    try {
        // Check content length limits for main content
        if (((_a = this.content) === null || _a === void 0 ? void 0 : _a.html) && this.content.html.length > 10000000) {
            return next(new Error("HTML content is too long. Maximum allowed length is 10MB."));
        }
        if (((_b = this.content) === null || _b === void 0 ? void 0 : _b.plainText) && this.content.plainText.length > 5000000) {
            return next(new Error("Plain text content is too long. Maximum allowed length is 5MB."));
        }
        // Check content length limits for dual-language content
        if (((_e = (_d = (_c = this.dualLanguage) === null || _c === void 0 ? void 0 : _c.en) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.html) && this.dualLanguage.en.content.html.length > 10000000) {
            return next(new Error("English HTML content is too long. Maximum allowed length is 10MB."));
        }
        if (((_h = (_g = (_f = this.dualLanguage) === null || _f === void 0 ? void 0 : _f.en) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.plainText) && this.dualLanguage.en.content.plainText.length > 5000000) {
            return next(new Error("English plain text content is too long. Maximum allowed length is 5MB."));
        }
        if (((_l = (_k = (_j = this.dualLanguage) === null || _j === void 0 ? void 0 : _j.ar) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.html) && this.dualLanguage.ar.content.html.length > 10000000) {
            return next(new Error("Arabic HTML content is too long. Maximum allowed length is 10MB."));
        }
        if (((_p = (_o = (_m = this.dualLanguage) === null || _m === void 0 ? void 0 : _m.ar) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.plainText) && this.dualLanguage.ar.content.plainText.length > 5000000) {
            return next(new Error("Arabic plain text content is too long. Maximum allowed length is 5MB."));
        }
        // Handle dual-language author, title, subtitle - ensure backward compatibility
        if (this.isModified("dualLanguageAuthor") || this.isNew) {
            // If dualLanguageAuthor is provided, use it; otherwise keep existing author
            if (((_q = this.dualLanguageAuthor) === null || _q === void 0 ? void 0 : _q.en) && !this.author) {
                this.author = this.dualLanguageAuthor.en;
            }
        }
        if (this.isModified("dualLanguageTitle") || this.isNew) {
            // If dualLanguageTitle is provided, use it; otherwise keep existing title
            if (((_r = this.dualLanguageTitle) === null || _r === void 0 ? void 0 : _r.en) && !this.title) {
                this.title = this.dualLanguageTitle.en;
            }
        }
        if (this.isModified("dualLanguageSubtitle") || this.isNew) {
            // If dualLanguageSubtitle is provided, use it; otherwise keep existing subtitle
            if (((_s = this.dualLanguageSubtitle) === null || _s === void 0 ? void 0 : _s.en) && !this.subtitle) {
                this.subtitle = this.dualLanguageSubtitle.en;
            }
        }
        // Update word count and reading time for main content
        if (this.isModified("content.plainText") || this.isNew) {
            const plain = (_u = (_t = this.content) === null || _t === void 0 ? void 0 : _t.plainText) !== null && _u !== void 0 ? _u : "";
            const words = plain.trim().length ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
            this.content.wordCount = words;
            const minutes = (0, readingTime_util_1.estimateReadingTimeInMinutes)(plain);
            this.stats.readingTime = minutes;
        }
        // Update word count and reading time for dual-language content
        if (this.isModified("dualLanguage.en.content.plainText") || this.isNew) {
            const plain = (_y = (_x = (_w = (_v = this.dualLanguage) === null || _v === void 0 ? void 0 : _v.en) === null || _w === void 0 ? void 0 : _w.content) === null || _x === void 0 ? void 0 : _x.plainText) !== null && _y !== void 0 ? _y : "";
            const words = plain.trim().length ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
            if ((_0 = (_z = this.dualLanguage) === null || _z === void 0 ? void 0 : _z.en) === null || _0 === void 0 ? void 0 : _0.content) {
                this.dualLanguage.en.content.wordCount = words;
            }
        }
        if (this.isModified("dualLanguage.ar.content.plainText") || this.isNew) {
            const plain = (_4 = (_3 = (_2 = (_1 = this.dualLanguage) === null || _1 === void 0 ? void 0 : _1.ar) === null || _2 === void 0 ? void 0 : _2.content) === null || _3 === void 0 ? void 0 : _3.plainText) !== null && _4 !== void 0 ? _4 : "";
            const words = plain.trim().length ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
            if ((_6 = (_5 = this.dualLanguage) === null || _5 === void 0 ? void 0 : _5.ar) === null || _6 === void 0 ? void 0 : _6.content) {
                this.dualLanguage.ar.content.wordCount = words;
            }
        }
        next();
    }
    catch (e) {
        next(e);
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
exports.Article = (0, mongoose_1.model)("Article", ArticleSchema);
