import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NewsletterService } from "./newsletter.service";

const subscribe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { email, firstName, lastName } = req.body;
	
	// Extract metadata from request
	const metadata = {
		source: req.body.source || "website",
		ipAddress: req.ip || req.connection.remoteAddress,
		userAgent: req.get('User-Agent')
	};

	const result = await NewsletterService.subscribeToNewsletter({
		email,
		firstName,
		lastName,
		metadata
	});

	// Determine response message based on Klaviyo success
	let message = "Successfully subscribed to newsletter";
	if (!result.klaviyoResponse.success) {
		message = "Successfully subscribed to newsletter (email service sync pending)";
	}

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message,
		data: {
			subscription: result.subscription,
			klaviyoResponse: result.klaviyoResponse
		}
	});
});

const unsubscribe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;

	const subscription = await NewsletterService.unsubscribeFromNewsletter(email);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Successfully unsubscribed from newsletter",
		data: subscription
	});
});

const getSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.params;

	const subscription = await NewsletterService.getSubscriptionByEmail(email);

	if (!subscription) {
		return sendResponse(res, {
			success: false,
			statusCode: httpStatus.NOT_FOUND,
			message: "Subscription not found",
			data: null
		});
	}

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Subscription found",
		data: subscription
	});
});

const getAllSubscriptions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { page = "1", limit = "20", status } = req.query as Record<string, string>;

	const result = await NewsletterService.getAllSubscriptions(
		Number(page),
		Number(limit),
		status
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Subscriptions retrieved successfully",
		data: result
	});
});

const getStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const stats = await NewsletterService.getSubscriptionStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Newsletter statistics retrieved successfully",
		data: stats
	});
});

const testEndpoint = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	// Simple test endpoint to verify the newsletter module is working
	const klaviyoConfigured = !!(process.env.KLAVIYO_LIST_ID && process.env.KLAVIYO_PRIVATE_API_KEY);
	
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Newsletter module is working",
		data: {
			klaviyoConfigured,
			klaviyoListId: process.env.KLAVIYO_LIST_ID ? "configured" : "not configured",
			timestamp: new Date().toISOString()
		}
	});
});

export const NewsletterController = {
	subscribe,
	unsubscribe,
	getSubscription,
	getAllSubscriptions,
	getStats,
	testEndpoint
};
