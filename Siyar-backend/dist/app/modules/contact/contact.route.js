"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
// Public routes
router.post("/create-contact", contact_controller_1.ContactController.createContact);
// Admin routes (you might want to add authentication middleware here)
router.get("/", contact_controller_1.ContactController.getAllContacts);
router.get("/stats", contact_controller_1.ContactController.getContactStats);
router.get("/search", contact_controller_1.ContactController.getAllContacts); // Uses search query parameter
router.get("/:id", contact_controller_1.ContactController.getContactById);
router.patch("/:id", contact_controller_1.ContactController.updateContact);
router.patch("/:id/status", contact_controller_1.ContactController.updateContactStatus);
router.delete("/:id", contact_controller_1.ContactController.deleteContact);
exports.contactRouter = router;
