import { Router } from "express";
import { ContactController } from "./contact.controller";

const router = Router()

// Public routes
router.post("/create-contact", ContactController.createContact)

// Admin routes (you might want to add authentication middleware here)
router.get("/", ContactController.getAllContacts)
router.get("/stats", ContactController.getContactStats)
router.get("/search", ContactController.getAllContacts) // Uses search query parameter
router.get("/:id", ContactController.getContactById)
router.patch("/:id", ContactController.updateContact)
router.patch("/:id/status", ContactController.updateContactStatus)
router.delete("/:id", ContactController.deleteContact)

export const contactRouter = router