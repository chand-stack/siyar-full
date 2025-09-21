import { FilterQuery, Types } from "mongoose";
import { Video } from "./video.model";
import { IVideo } from "./video.interface";

const createVideo = async (payload: Partial<IVideo>) => {
	// If this video is being set as featured, unfeature all other videos
	if (payload.isFeatured) {
		await Video.updateMany({}, { isFeatured: false });
	}
	const video = await Video.create(payload);
	return video;
};

const getVideoById = async (id: string) => {
	return Video.findById(id);
};

const listVideos = async (filter: FilterQuery<IVideo> = {}, limit = 20, page = 1) => {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Video.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
		Video.countDocuments(filter)
	]);
	return { items, total, page, limit };
};

const updateVideo = async (id: string, payload: Partial<IVideo>) => {
	// If this video is being set as featured, unfeature all other videos
	if (payload.isFeatured) {
		await Video.updateMany({ _id: { $ne: id } }, { isFeatured: false });
	}
	return Video.findByIdAndUpdate(id, payload, { new: true });
};

const deleteVideo = async (id: string) => {
	return Video.findByIdAndDelete(id);
};

const incrementViews = async (id: string) => {
	return Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
};

const getFeaturedVideos = async (limit = 10) => {
	return Video.find({ status: "published", isFeatured: true })
		.sort({ createdAt: -1 })
		.limit(limit);
};

const setVideoAsFeatured = async (id: string) => {
	// First, unfeature all videos
	await Video.updateMany({}, { isFeatured: false });
	// Then, feature the specified video
	return Video.findByIdAndUpdate(id, { isFeatured: true }, { new: true });
};

export const VideoService = {
	createVideo,
	getVideoById,
	listVideos,
	updateVideo,
	deleteVideo,
	incrementViews,
	getFeaturedVideos,
	setVideoAsFeatured
};
