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
exports.NewsletterController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const newsletter_service_1 = require("./newsletter.service");
const subscribe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName } = req.body;
    // Extract metadata from request
    const metadata = {
        source: req.body.source || "website",
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    };
    const result = yield newsletter_service_1.NewsletterService.subscribeToNewsletter({
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
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message,
        data: {
            subscription: result.subscription,
            klaviyoResponse: result.klaviyoResponse
        }
    });
}));
const unsubscribe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const subscription = yield newsletter_service_1.NewsletterService.unsubscribeFromNewsletter(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Successfully unsubscribed from newsletter",
        data: subscription
    });
}));
const getSubscription = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const subscription = yield newsletter_service_1.NewsletterService.getSubscriptionByEmail(email);
    if (!subscription) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Subscription not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Subscription found",
        data: subscription
    });
}));
const getAllSubscriptions = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", limit = "20", status } = req.query;
    const result = yield newsletter_service_1.NewsletterService.getAllSubscriptions(Number(page), Number(limit), status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Subscriptions retrieved successfully",
        data: result
    });
}));
const getStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield newsletter_service_1.NewsletterService.getSubscriptionStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Newsletter statistics retrieved successfully",
        data: stats
    });
}));
const testEndpoint = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Simple test endpoint to verify the newsletter module is working
    const klaviyoConfigured = !!(process.env.KLAVIYO_LIST_ID && process.env.KLAVIYO_PRIVATE_API_KEY);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Newsletter module is working",
        data: {
            klaviyoConfigured,
            klaviyoListId: process.env.KLAVIYO_LIST_ID ? "configured" : "not configured",
            timestamp: new Date().toISOString()
        }
    });
}));
exports.NewsletterController = {
    subscribe,
    unsubscribe,
    getSubscription,
    getAllSubscriptions,
    getStats,
    testEndpoint
};
