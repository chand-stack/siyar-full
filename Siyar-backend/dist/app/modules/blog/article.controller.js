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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const article_service_1 = require("./article.service");
const translation_service_1 = require("./translation.service");
const create = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield article_service_1.ArticleService.createArticle(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "article created successfully",
        data: created
    });
}));
const list = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", limit = "20", language, category, series } = req.query;
    const filter = {};
    if (language)
        filter.language = language;
    if (category)
        filter.categories = category;
    if (series)
        filter["series.id"] = series;
    const result = yield article_service_1.ArticleService.listArticles(filter, Number(limit), Number(page));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "articles fetched successfully",
        data: result
    });
}));
const translate = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { targetLanguage } = req.body;
    const result = yield (0, translation_service_1.translateArticle)(id, targetLanguage);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "article translated successfully",
        data: result
    });
}));
const getBySlug = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const { language } = req.query;
    const item = yield article_service_1.ArticleService.getArticleBySlugDualLanguage(slug, (language !== null && language !== void 0 ? language : "en"));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "article fetched successfully",
        data: item
    });
}));
const translatePreview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { targetLanguage } = req.query;
    const language = (targetLanguage !== null && targetLanguage !== void 0 ? targetLanguage : "en");
    const result = yield (0, translation_service_1.previewTranslation)(id, language);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "article translation preview",
        data: result
    });
}));
const update = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield article_service_1.ArticleService.updateArticle(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "article updated successfully",
        data: updated
    });
}));
const remove = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield article_service_1.ArticleService.deleteArticle(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "article deleted successfully",
        data: null
    });
}));
// New dual-language controller methods
const createDualLanguage = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield article_service_1.ArticleService.createDualLanguageArticle(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "dual-language article created successfully",
        data: created
    });
}));
const updateDualLanguage = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield article_service_1.ArticleService.updateDualLanguageArticle(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "dual-language article updated successfully",
        data: updated
    });
}));
const addArabicVersion = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield article_service_1.ArticleService.addArabicVersionToExistingArticle(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Arabic version added successfully",
        data: updated
    });
}));
// New controller methods for dual-language author, title, subtitle
const addArabicAuthorTitleSubtitle = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield article_service_1.ArticleService.addArabicAuthorTitleSubtitle(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Arabic author, title, and subtitle added successfully",
        data: updated
    });
}));
const updateDualLanguageFields = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield article_service_1.ArticleService.updateDualLanguageFields(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Dual-language fields updated successfully",
        data: updated
    });
}));
exports.ArticleController = {
    create,
    list,
    translate,
    getBySlug,
    translatePreview,
    update,
    remove,
    // New dual-language methods
    createDualLanguage,
    updateDualLanguage,
    addArabicVersion,
    // New dual-language author, title, subtitle methods
    addArabicAuthorTitleSubtitle,
    updateDualLanguageFields
};
