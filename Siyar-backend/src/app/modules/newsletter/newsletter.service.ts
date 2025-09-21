import axios from "axios";
import { NewsletterSubscription } from "./newsletter.model";
import { INewsletterSubscription } from "./newsletter.interface";

interface KlaviyoSubscribePayload {
	email: string;
	firstName?: string;
	lastName?: string;
	metadata?: {
		source?: string;
		ipAddress?: string;
		userAgent?: string;
	};
}

interface KlaviyoResponse {
	success: boolean;
	data?: any;
	error?: string;
}

const subscribeToNewsletter = async (payload: KlaviyoSubscribePayload): Promise<{ subscription: INewsletterSubscription; klaviyoResponse: KlaviyoResponse }> => {
	try {
		// Check if email already exists
		const existingSubscription = await NewsletterSubscription.findOne({ email: payload.email.toLowerCase() });
		
		if (existingSubscription) {
			if (existingSubscription.status === "active") {
				throw new Error("Email is already subscribed to the newsletter");
			} else if (existingSubscription.status === "unsubscribed") {
				// Reactivate subscription
				existingSubscription.status = "active";
				existingSubscription.subscribedAt = new Date();
				existingSubscription.unsubscribedAt = undefined;
				await existingSubscription.save();
				return { subscription: existingSubscription, klaviyoResponse: { success: true, data: "Reactivated existing subscription" } };
			}
		}

		// Try to subscribe to Klaviyo (but don't fail if it doesn't work)
		let klaviyoResponse: KlaviyoResponse;
		
		// Check if Klaviyo is configured
		if (process.env.KLAVIYO_LIST_ID && process.env.KLAVIYO_PRIVATE_API_KEY) {
			try {
				klaviyoResponse = await subscribeToKlaviyo(payload);
			} catch (klaviyoError: any) {
				console.warn("Klaviyo subscription failed, but continuing with database save:", klaviyoError.message);
				klaviyoResponse = {
					success: false,
					error: klaviyoError.message,
					data: { message: "Klaviyo sync failed but subscription saved locally" }
				};
			}
		} else {
			console.warn("Klaviyo not configured, saving subscription to database only");
			klaviyoResponse = {
				success: true,
				data: { message: "Subscription saved to database (Klaviyo not configured)" }
			};
		}
		
		// Save to database regardless of Klaviyo success/failure
		const subscriptionData = {
			email: payload.email.toLowerCase(),
			firstName: payload.firstName,
			lastName: payload.lastName,
			status: "active" as const,
			klaviyoProfileId: klaviyoResponse.data?.id || klaviyoResponse.data?.profileId,
			metadata: payload.metadata
		};

		const subscription = existingSubscription 
			? await NewsletterSubscription.findByIdAndUpdate(existingSubscription._id, subscriptionData, { new: true })
			: await NewsletterSubscription.create(subscriptionData);

		return { subscription: subscription!, klaviyoResponse };
	} catch (error: any) {
		throw new Error(error.message || "Failed to subscribe to newsletter");
	}
};

const subscribeToKlaviyo = async (payload: KlaviyoSubscribePayload): Promise<KlaviyoResponse> => {
	try {
		const listId = process.env.KLAVIYO_LIST_ID;
		const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;

		if (!listId || !apiKey) {
			throw new Error("Klaviyo configuration is missing");
		}

		// Use current Klaviyo API with proper REVISION header
		try {
			console.log("Attempting Klaviyo API with REVISION header...");
			
			// First, create or get the profile
			const profileData = {
				type: "profile",
				attributes: {
					email: payload.email,
					first_name: payload.firstName,
					last_name: payload.lastName,
					properties: {
						$source: payload.metadata?.source || "website",
						$consent: "email"
					}
				}
			};

			console.log("Creating profile with data:", profileData);

			// Create profile first
			const profileResponse = await axios.post('https://a.klaviyo.com/api/profiles/', {
				data: profileData
			}, {
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Klaviyo-API-Key ${apiKey}`,
					'revision': '2024-10-15',
					'User-Agent': 'Siyar-Backend/1.0'
				},
				timeout: 15000
			});

			console.log("Profile created successfully:", profileResponse.data);
			const profileId = profileResponse.data.data.id;

			// Add profile to list
			const listPayload = {
				data: [
					{
						type: "profile",
						id: profileId
					}
				]
			};

			console.log("Adding profile to list:", listPayload);

			const listResponse = await axios.post(`https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`, listPayload, {
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Klaviyo-API-Key ${apiKey}`,
					'revision': '2024-10-15',
					'User-Agent': 'Siyar-Backend/1.0'
				},
				timeout: 15000
			});

			console.log("Profile added to list successfully:", listResponse.data);

			return {
				success: true,
				data: {
					profileId,
					listResponse: listResponse.data,
					message: "Successfully subscribed using Klaviyo API"
				}
			};

		} catch (apiError: any) {
			console.log("Klaviyo API failed:", apiError?.response?.data || apiError.message);
			throw apiError; // Re-throw the error to be handled by the calling function
		}

	} catch (error: any) {
		console.error("Klaviyo API Error:", error?.response?.data || error.message);
		
		// Handle specific Klaviyo errors
		if (error?.response?.status === 400) {
			const errorData = error.response.data;
			if (errorData?.detail?.includes("already subscribed") || errorData?.detail?.includes("already exists")) {
				return {
					success: true,
					data: { message: "Already subscribed" }
				};
			}
		}

		// Handle 410 Gone error (deprecated endpoint)
		if (error?.response?.status === 410) {
			console.warn("Klaviyo API endpoint returned 410 Gone - endpoint may be deprecated");
			// Return success but log the issue
			return {
				success: true,
				data: { 
					message: "Subscription processed (API endpoint deprecated but subscription recorded locally)",
					warning: "Klaviyo API endpoint returned 410 - please update API configuration"
				}
			};
		}

		// For other errors, still save to database but log the Klaviyo failure
		console.error("Klaviyo subscription failed, but will save to database:", error?.response?.data?.detail || error.message);
		return {
			success: false,
			error: `Klaviyo subscription failed: ${error?.response?.data?.detail || error.message}`,
			data: { message: "Saved to database but Klaviyo sync failed" }
		};
	}
};

const unsubscribeFromNewsletter = async (email: string): Promise<INewsletterSubscription> => {
	try {
		const subscription = await NewsletterSubscription.findOne({ email: email.toLowerCase() });
		
		if (!subscription) {
			throw new Error("Email not found in newsletter subscriptions");
		}

		if (subscription.status === "unsubscribed") {
			throw new Error("Email is already unsubscribed");
		}

		// Update status in database
		subscription.status = "unsubscribed";
		subscription.unsubscribedAt = new Date();
		await subscription.save();

		// Note: Klaviyo unsubscription would require additional API call
		// For now, we just update our database

		return subscription;
	} catch (error: any) {
		throw new Error(error.message || "Failed to unsubscribe from newsletter");
	}
};

const getSubscriptionByEmail = async (email: string): Promise<INewsletterSubscription | null> => {
	return NewsletterSubscription.findOne({ email: email.toLowerCase() });
};

const getAllSubscriptions = async (page = 1, limit = 20, status?: string) => {
	const skip = (page - 1) * limit;
	const filter: any = {};
	
	if (status) {
		filter.status = status;
	}

	const [subscriptions, total] = await Promise.all([
		NewsletterSubscription.find(filter)
			.sort({ subscribedAt: -1 })
			.skip(skip)
			.limit(limit),
		NewsletterSubscription.countDocuments(filter)
	]);

	return {
		subscriptions,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit)
	};
};

const getSubscriptionStats = async () => {
	const [total, active, unsubscribed, pending] = await Promise.all([
		NewsletterSubscription.countDocuments(),
		NewsletterSubscription.countDocuments({ status: "active" }),
		NewsletterSubscription.countDocuments({ status: "unsubscribed" }),
		NewsletterSubscription.countDocuments({ status: "pending" })
	]);

	return {
		total,
		active,
		unsubscribed,
		pending
	};
};

export const NewsletterService = {
	subscribeToNewsletter,
	unsubscribeFromNewsletter,
	getSubscriptionByEmail,
	getAllSubscriptions,
	getSubscriptionStats
};
