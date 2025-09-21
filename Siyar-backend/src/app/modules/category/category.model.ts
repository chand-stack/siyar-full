import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new Schema<ICategory>({
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

export const Category = model<ICategory>("Category", CategorySchema);


