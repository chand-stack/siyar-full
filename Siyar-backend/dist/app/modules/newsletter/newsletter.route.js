"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
exports.NewsletterRoutes = (0, express_1.Router)();
// Public routes
exports.NewsletterRoutes.post("/subscribe", newsletter_controller_1.NewsletterController.subscribe);
exports.NewsletterRoutes.post("/unsubscribe", newsletter_controller_1.NewsletterController.unsubscribe);
exports.NewsletterRoutes.get("/subscription/:email", newsletter_controller_1.NewsletterController.getSubscription);
// Test endpoint
exports.NewsletterRoutes.get("/test", newsletter_controller_1.NewsletterController.testEndpoint);
// Admin routes (you might want to add authentication middleware here)
exports.NewsletterRoutes.get("/", newsletter_controller_1.NewsletterController.getAllSubscriptions);
exports.NewsletterRoutes.get("/stats", newsletter_controller_1.NewsletterController.getStats);
