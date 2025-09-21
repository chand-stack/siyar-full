"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const axios_1 = __importDefault(require("axios"));
const newsletter_model_1 = require("./newsletter.model");
const subscribeToNewsletter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Check if email already exists
        const existingSubscription = yield newsletter_model_1.NewsletterSubscription.findOne({ email: payload.email.toLowerCase() });
        if (existingSubscription) {
            if (existingSubscription.status === "active") {
                throw new Error("Email is already subscribed to the newsletter");
            }
            else if (existingSubscription.status === "unsubscribed") {
                // Reactivate subscription
                existingSubscription.status = "active";
                existingSubscription.subscribedAt = new Date();
                existingSubscription.unsubscribedAt = undefined;
                yield existingSubscription.save();
                return { subscription: existingSubscription, klaviyoResponse: { success: true, data: "Reactivated existing subscription" } };
            }
        }
        // Try to subscribe to Klaviyo (but don't fail if it doesn't work)
        let klaviyoResponse;
        // Check if Klaviyo is configured
        if (process.env.KLAVIYO_LIST_ID && process.env.KLAVIYO_PRIVATE_API_KEY) {
            try {
                klaviyoResponse = yield subscribeToKlaviyo(payload);
            }
            catch (klaviyoError) {
                console.warn("Klaviyo subscription failed, but continuing with database save:", klaviyoError.message);
                klaviyoResponse = {
                    success: false,
                    error: klaviyoError.message,
                    data: { message: "Klaviyo sync failed but subscription saved locally" }
                };
            }
        }
        else {
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
            status: "active",
            klaviyoProfileId: ((_a = klaviyoResponse.data) === null || _a === void 0 ? void 0 : _a.id) || ((_b = klaviyoResponse.data) === null || _b === void 0 ? void 0 : _b.profileId),
            metadata: payload.metadata
        };
        const subscription = existingSubscription
            ? yield newsletter_model_1.NewsletterSubscription.findByIdAndUpdate(existingSubscription._id, subscriptionData, { new: true })
            : yield newsletter_model_1.NewsletterSubscription.create(subscriptionData);
        return { subscription: subscription, klaviyoResponse };
    }
    catch (error) {
        throw new Error(error.message || "Failed to subscribe to newsletter");
    }
});
const subscribeToKlaviyo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
                        $source: ((_a = payload.metadata) === null || _a === void 0 ? void 0 : _a.source) || "website",
                        $consent: "email"
                    }
                }
            };
            console.log("Creating profile with data:", profileData);
            // Create profile first
            const profileResponse = yield axios_1.default.post('https://a.klaviyo.com/api/profiles/', {
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
            const listResponse = yield axios_1.default.post(`https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`, listPayload, {
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
        }
        catch (apiError) {
            console.log("Klaviyo API failed:", ((_b = apiError === null || apiError === void 0 ? void 0 : apiError.response) === null || _b === void 0 ? void 0 : _b.data) || apiError.message);
            throw apiError; // Re-throw the error to be handled by the calling function
        }
    }
    catch (error) {
        console.error("Klaviyo API Error:", ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
        // Handle specific Klaviyo errors
        if (((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.status) === 400) {
            const errorData = error.response.data;
            if (((_e = errorData === null || errorData === void 0 ? void 0 : errorData.detail) === null || _e === void 0 ? void 0 : _e.includes("already subscribed")) || ((_f = errorData === null || errorData === void 0 ? void 0 : errorData.detail) === null || _f === void 0 ? void 0 : _f.includes("already exists"))) {
                return {
                    success: true,
                    data: { message: "Already subscribed" }
                };
            }
        }
        // Handle 410 Gone error (deprecated endpoint)
        if (((_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.status) === 410) {
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
        console.error("Klaviyo subscription failed, but will save to database:", ((_j = (_h = error === null || error === void 0 ? void 0 : error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.detail) || error.message);
        return {
            success: false,
            error: `Klaviyo subscription failed: ${((_l = (_k = error === null || error === void 0 ? void 0 : error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.detail) || error.message}`,
            data: { message: "Saved to database but Klaviyo sync failed" }
        };
    }
});
const unsubscribeFromNewsletter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscription = yield newsletter_model_1.NewsletterSubscription.findOne({ email: email.toLowerCase() });
        if (!subscription) {
            throw new Error("Email not found in newsletter subscriptions");
        }
        if (subscription.status === "unsubscribed") {
            throw new Error("Email is already unsubscribed");
        }
        // Update status in database
        subscription.status = "unsubscribed";
        subscription.unsubscribedAt = new Date();
        yield subscription.save();
        // Note: Klaviyo unsubscription would require additional API call
        // For now, we just update our database
        return subscription;
    }
    catch (error) {
        throw new Error(error.message || "Failed to unsubscribe from newsletter");
    }
});
const getSubscriptionByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return newsletter_model_1.NewsletterSubscription.findOne({ email: email.toLowerCase() });
});
const getAllSubscriptions = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20, status) {
    const skip = (page - 1) * limit;
    const filter = {};
    if (status) {
        filter.status = status;
    }
    const [subscriptions, total] = yield Promise.all([
        newsletter_model_1.NewsletterSubscription.find(filter)
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit),
        newsletter_model_1.NewsletterSubscription.countDocuments(filter)
    ]);
    return {
        subscriptions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
});
const getSubscriptionStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [total, active, unsubscribed, pending] = yield Promise.all([
        newsletter_model_1.NewsletterSubscription.countDocuments(),
        newsletter_model_1.NewsletterSubscription.countDocuments({ status: "active" }),
        newsletter_model_1.NewsletterSubscription.countDocuments({ status: "unsubscribed" }),
        newsletter_model_1.NewsletterSubscription.countDocuments({ status: "pending" })
    ]);
    return {
        total,
        active,
        unsubscribed,
        pending
    };
});
exports.NewsletterService = {
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    getSubscriptionByEmail,
    getAllSubscriptions,
    getSubscriptionStats
};
