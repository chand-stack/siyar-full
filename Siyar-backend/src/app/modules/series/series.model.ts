import { model, Schema } from "mongoose";
import { ISeries } from "./series.interface";

const SeriesSchema = new Schema<ISeries>({
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

export const Series = model<ISeries>("Series", SeriesSchema);


