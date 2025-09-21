import { Document } from "mongoose";

export interface ICategory extends Document {
	title: string;
	slug: string;
	language: string;
	isActive: boolean;
}


