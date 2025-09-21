import { Document } from "mongoose";

export interface INewsletterSubscription extends Document {
	email: string;
	firstName?: string;
	lastName?: string;
	status: "active" | "unsubscribed" | "pending";
	klaviyoProfileId?: string;
	subscribedAt: Date;
	unsubscribedAt?: Date;
	metadata?: {
		source?: string;
		ipAddress?: string;
		userAgent?: string;
	};
}
