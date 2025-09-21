"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Series = void 0;
const mongoose_1 = require("mongoose");
const SeriesSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    language: { type: String, default: 'en' },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    collection: "series",
    versionKey: false
});
// Prevent duplicate slugs per language
SeriesSchema.index({ slug: 1, language: 1 }, { unique: true });
exports.Series = (0, mongoose_1.model)("Series", SeriesSchema);
