import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ArticleService } from "./article.service";
import { previewTranslation, translateArticle } from "./translation.service";
import { SupportedLanguage } from "./article.interface";

const create = catchAsync(async (req: Request, res: Response) => {
	const created = await ArticleService.createArticle(req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "article created successfully",
		data: created
	});
});

const list = catchAsync(async (req: Request, res: Response) => {
	const { page = "1", limit = "20", language, category, series } = req.query as Record<string, string>;
	const filter: any = {};
	if (language) filter.language = language;
	if (category) filter.categories = category;
	if (series) filter["series.id"] = series;
	const result = await ArticleService.listArticles(filter, Number(limit), Number(page));
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "articles fetched successfully",
		data: result
	});
});

const translate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const { targetLanguage } = req.body as { targetLanguage: SupportedLanguage };
	const result = await translateArticle(id, targetLanguage);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "article translated successfully",
		data: result
	});
});

const getBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;
	const { language } = req.query as { language?: SupportedLanguage };
	const item = await ArticleService.getArticleBySlugDualLanguage(slug, (language ?? "en") as SupportedLanguage);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "article fetched successfully",
		data: item
	});
});

const translatePreview = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { targetLanguage } = req.query as { targetLanguage?: SupportedLanguage };
	const language = (targetLanguage ?? "en") as SupportedLanguage;
	const result = await previewTranslation(id, language);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "article translation preview",
		data: result
	});
});

const update = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updated = await ArticleService.updateArticle(id, req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "article updated successfully",
		data: updated
	});
});

const remove = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await ArticleService.deleteArticle(id);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "article deleted successfully",
		data: null
	});
});

// New dual-language controller methods
const createDualLanguage = catchAsync(async (req: Request, res: Response) => {
	const created = await ArticleService.createDualLanguageArticle(req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "dual-language article created successfully",
		data: created
	});
});

const updateDualLanguage = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updated = await ArticleService.updateDualLanguageArticle(id, req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "dual-language article updated successfully",
		data: updated
	});
});

const addArabicVersion = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updated = await ArticleService.addArabicVersionToExistingArticle(id, req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Arabic version added successfully",
		data: updated
	});
});

// New controller methods for dual-language author, title, subtitle
const addArabicAuthorTitleSubtitle = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updated = await ArticleService.addArabicAuthorTitleSubtitle(id, req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Arabic author, title, and subtitle added successfully",
		data: updated
	});
});

const updateDualLanguageFields = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updated = await ArticleService.updateDualLanguageFields(id, req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Dual-language fields updated successfully",
		data: updated
	});
});

export const ArticleController = { 
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


