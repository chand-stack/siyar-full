import { Document } from "mongoose";

export interface IVideo extends Document {
	title: string;
	videoLink: string;
	status: "draft" | "published" | "archived";
	isFeatured: boolean;
	createdAt: Date;
	updatedAt: Date;
}
