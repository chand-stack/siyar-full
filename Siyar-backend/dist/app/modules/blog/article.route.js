"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRoutes = void 0;
const express_1 = require("express");
const article_controller_1 = require("./article.controller");
exports.ArticleRoutes = (0, express_1.Router)();
exports.ArticleRoutes.post("/", article_controller_1.ArticleController.create);
exports.ArticleRoutes.get("/", article_controller_1.ArticleController.list);
exports.ArticleRoutes.get("/:slug", article_controller_1.ArticleController.getBySlug);
exports.ArticleRoutes.post("/:id/translate", article_controller_1.ArticleController.translate);
exports.ArticleRoutes.get("/:id/translate/preview", article_controller_1.ArticleController.translatePreview);
exports.ArticleRoutes.patch("/:id", article_controller_1.ArticleController.update);
exports.ArticleRoutes.delete("/:id", article_controller_1.ArticleController.remove);
// New dual-language routes
exports.ArticleRoutes.post("/dual-language", article_controller_1.ArticleController.createDualLanguage);
exports.ArticleRoutes.patch("/:id/dual-language", article_controller_1.ArticleController.updateDualLanguage);
exports.ArticleRoutes.post("/:id/arabic-version", article_controller_1.ArticleController.addArabicVersion);
// New dual-language author, title, subtitle routes
exports.ArticleRoutes.post("/:id/arabic-fields", article_controller_1.ArticleController.addArabicAuthorTitleSubtitle);
exports.ArticleRoutes.patch("/:id/dual-language-fields", article_controller_1.ArticleController.updateDualLanguageFields);
