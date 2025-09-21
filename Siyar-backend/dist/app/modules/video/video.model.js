"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const VideoSchema = new mongoose_1.Schema({
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
exports.Video = (0, mongoose_1.model)("Video", VideoSchema);
