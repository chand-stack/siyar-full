import { model, Schema } from "mongoose";
import { IVideo } from "./video.interface";

const VideoSchema = new Schema<IVideo>({
	title: { type: String, required: true },
	videoLink: { type: String, required: true },
	status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
	isFeatured: { type: Boolean, default: false },
}, {
	timestamps: true,
	collection: "videos",
	versionKey: false
});

// Indexes for performance
VideoSchema.index({ title: 1 });
VideoSchema.index({ status: 1 });
VideoSchema.index({ isFeatured: 1 });
VideoSchema.index({ author: 1 });
VideoSchema.index({ createdAt: -1 });

export const Video = model<IVideo>("Video", VideoSchema);
