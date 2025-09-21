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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const video_model_1 = require("./video.model");
const createVideo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // If this video is being set as featured, unfeature all other videos
    if (payload.isFeatured) {
        yield video_model_1.Video.updateMany({}, { isFeatured: false });
    }
    const video = yield video_model_1.Video.create(payload);
    return video;
});
const getVideoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return video_model_1.Video.findById(id);
});
const listVideos = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const [items, total] = yield Promise.all([
        video_model_1.Video.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        video_model_1.Video.countDocuments(filter)
    ]);
    return { items, total, page, limit };
});
const updateVideo = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // If this video is being set as featured, unfeature all other videos
    if (payload.isFeatured) {
        yield video_model_1.Video.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }
    return video_model_1.Video.findByIdAndUpdate(id, payload, { new: true });
});
const deleteVideo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return video_model_1.Video.findByIdAndDelete(id);
});
const incrementViews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return video_model_1.Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
});
const getFeaturedVideos = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    return video_model_1.Video.find({ status: "published", isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(limit);
});
const setVideoAsFeatured = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // First, unfeature all videos
    yield video_model_1.Video.updateMany({}, { isFeatured: false });
    // Then, feature the specified video
    return video_model_1.Video.findByIdAndUpdate(id, { isFeatured: true }, { new: true });
});
exports.VideoService = {
    createVideo,
    getVideoById,
    listVideos,
    updateVideo,
    deleteVideo,
    incrementViews,
    getFeaturedVideos,
    setVideoAsFeatured
};
