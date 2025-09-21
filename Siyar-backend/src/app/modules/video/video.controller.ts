import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VideoService } from "./video.service";

const create = catchAsync(async (req: Request, res: Response) => {
	const created = await VideoService.createVideo(req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Video created successfully",
		data: created
	});
});

const list = catchAsync(async (req: Request, res: Response) => {
	const { page = "1", limit = "20", status, featured, author } = req.query as Record<string, string>;
	const filter: any = {};
	if (status) filter.status = status;
	if (featured === "true") filter.isFeatured = true;
	if (author) filter.author = author;
	
	const result = await VideoService.listVideos(filter, Number(limit), Number(page));
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Videos fetched successfully",
		data: result
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const item = await VideoService.getVideoById(id);
	
	if (!item) {
		return sendResponse(res, {
			success: false,
			statusCode: httpStatus.NOT_FOUND,
			message: "Video not found",
			data: null
		});
	}
	
	// Increment views when video is accessed
	await VideoService.incrementViews(id);
	
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Video fetched successfully",
		data: item
	});
});

const update = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const updated = await VideoService.updateVideo(id, req.body);
	
	if (!updated) {
		return sendResponse(res, {
			success: false,
			statusCode: httpStatus.NOT_FOUND,
			message: "Video not found",
			data: null
		});
	}
	
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Video updated successfully",
		data: updated
	});
});

const remove = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const deleted = await VideoService.deleteVideo(id);
	
	if (!deleted) {
		return sendResponse(res, {
			success: false,
			statusCode: httpStatus.NOT_FOUND,
			message: "Video not found",
			data: null
		});
	}
	
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Video deleted successfully",
		data: null
	});
});

const getFeatured = catchAsync(async (req: Request, res: Response) => {
	const { limit = "10" } = req.query as Record<string, string>;
	const videos = await VideoService.getFeaturedVideos(Number(limit));
	
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Featured videos fetched successfully",
		data: videos
	});
});

const setAsFeatured = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const video = await VideoService.setVideoAsFeatured(id);
	
	if (!video) {
		return sendResponse(res, {
			success: false,
			statusCode: httpStatus.NOT_FOUND,
			message: "Video not found",
			data: null
		});
	}
	
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Video set as featured successfully",
		data: video
	});
});

export const VideoController = { 
	create, 
	list, 
	getById, 
	update, 
	remove, 
	getFeatured,
	setAsFeatured
};
