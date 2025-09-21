import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

const create = catchAsync(async (req: Request, res: Response) => {
	const created = await CategoryService.create(req.body);
	sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "category created", data: created });
});

const list = catchAsync(async (req: Request, res: Response) => {
	const data = await CategoryService.list(req.query || {});
	sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "categories fetched", data });
});

const update = catchAsync(async (req: Request, res: Response) => {
	const updated = await CategoryService.update(req.params.id, req.body);
	sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "category updated", data: updated });
});

const remove = catchAsync(async (req: Request, res: Response) => {
	await CategoryService.remove(req.params.id);
	sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "category removed", data: null });
});

export const CategoryController = { create, list, update, remove };


