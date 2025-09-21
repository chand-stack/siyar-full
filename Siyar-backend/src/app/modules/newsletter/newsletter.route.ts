import { Router } from "express";
import { NewsletterController } from "./newsletter.controller";

export const NewsletterRoutes = Router();

// Public routes
NewsletterRoutes.post("/subscribe", NewsletterController.subscribe);
NewsletterRoutes.post("/unsubscribe", NewsletterController.unsubscribe);
NewsletterRoutes.get("/subscription/:email", NewsletterController.getSubscription);

// Test endpoint
NewsletterRoutes.get("/test", NewsletterController.testEndpoint);

// Admin routes (you might want to add authentication middleware here)
NewsletterRoutes.get("/", NewsletterController.getAllSubscriptions);
NewsletterRoutes.get("/stats", NewsletterController.getStats);
