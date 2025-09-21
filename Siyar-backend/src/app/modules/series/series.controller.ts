import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SeriesService } from "./series.service";

const create = catchAsync(async (req: Request, res: Response) => {
	const created = await SeriesService.create(req.body);
	sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "series created", data: created });
});

const list = catchAsync(async (req: Request, res: Response) => {
	const data = await SeriesService.list(req.query || {});
	sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "series fetched", data });
});

const update = catchAsync(async (req: Request, res: Response) => {
	const updated = await SeriesService.update(req.params.id, req.body);
	sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "series updated", data: updated });
});

const remove = catchAsync(async (req: Request, res: Response) => {
	await SeriesService.remove(req.params.id);
	sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "series removed", data: null });
});

export const SeriesController = { create, list, update, remove };


