"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterSubscription = void 0;
const mongoose_1 = require("mongoose");
const NewsletterSubscriptionSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    status: {
        type: String,
        enum: ["active", "unsubscribed", "pending"],
        default: "active"
    },
    klaviyoProfileId: {
        type: String
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    unsubscribedAt: {
        type: Date
    },
    metadata: {
        source: { type: String },
        ipAddress: { type: String },
        userAgent: { type: String }
    }
}, {
    timestamps: true,
    collection: "newsletter_subscriptions",
    versionKey: false
});
// Indexes for performance
NewsletterSubscriptionSchema.index({ email: 1 });
NewsletterSubscriptionSchema.index({ status: 1 });
NewsletterSubscriptionSchema.index({ subscribedAt: -1 });
NewsletterSubscriptionSchema.index({ klaviyoProfileId: 1 });
exports.NewsletterSubscription = (0, mongoose_1.model)("NewsletterSubscription", NewsletterSubscriptionSchema);
