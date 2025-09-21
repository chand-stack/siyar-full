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
exports.VideoController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const video_service_1 = require("./video.service");
const create = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield video_service_1.VideoService.createVideo(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Video created successfully",
        data: created
    });
}));
const list = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", limit = "20", status, featured, author } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (featured === "true")
        filter.isFeatured = true;
    if (author)
        filter.author = author;
    const result = yield video_service_1.VideoService.listVideos(filter, Number(limit), Number(page));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Videos fetched successfully",
        data: result
    });
}));
const getById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield video_service_1.VideoService.getVideoById(id);
    if (!item) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Video not found",
            data: null
        });
    }
    // Increment views when video is accessed
    yield video_service_1.VideoService.incrementViews(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Video fetched successfully",
        data: item
    });
}));
const update = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield video_service_1.VideoService.updateVideo(id, req.body);
    if (!updated) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Video not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Video updated successfully",
        data: updated
    });
}));
const remove = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleted = yield video_service_1.VideoService.deleteVideo(id);
    if (!deleted) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Video not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Video deleted successfully",
        data: null
    });
}));
const getFeatured = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = "10" } = req.query;
    const videos = yield video_service_1.VideoService.getFeaturedVideos(Number(limit));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Featured videos fetched successfully",
        data: videos
    });
}));
const setAsFeatured = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const video = yield video_service_1.VideoService.setVideoAsFeatured(id);
    if (!video) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Video not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Video set as featured successfully",
        data: video
    });
}));
exports.VideoController = {
    create,
    list,
    getById,
    update,
    remove,
    getFeatured,
    setAsFeatured
};
