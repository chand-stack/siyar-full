"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    language: { type: String, required: true, default: 'en' },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    collection: "categories",
    versionKey: false
});
// Prevent duplicate slugs per language
CategorySchema.index({ slug: 1, language: 1 }, { unique: true });
exports.Category = (0, mongoose_1.model)("Category", CategorySchema);
