import { Document } from "mongoose";

export interface ISeries extends Document {
	title: string;
	slug: string;
	language: string;
	isActive: boolean;
}


