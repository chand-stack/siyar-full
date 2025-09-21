import { Router } from "express";
import { ArticleController } from "./article.controller";

export const ArticleRoutes = Router();

ArticleRoutes.post("/", ArticleController.create);
ArticleRoutes.get("/", ArticleController.list);
ArticleRoutes.get("/:slug", ArticleController.getBySlug);
ArticleRoutes.post("/:id/translate", ArticleController.translate);
ArticleRoutes.get("/:id/translate/preview", ArticleController.translatePreview);
ArticleRoutes.patch("/:id", ArticleController.update);
ArticleRoutes.delete("/:id", ArticleController.remove);

// New dual-language routes
ArticleRoutes.post("/dual-language", ArticleController.createDualLanguage);
ArticleRoutes.patch("/:id/dual-language", ArticleController.updateDualLanguage);
ArticleRoutes.post("/:id/arabic-version", ArticleController.addArabicVersion);
// New dual-language author, title, subtitle routes
ArticleRoutes.post("/:id/arabic-fields", ArticleController.addArabicAuthorTitleSubtitle);
ArticleRoutes.patch("/:id/dual-language-fields", ArticleController.updateDualLanguageFields);


