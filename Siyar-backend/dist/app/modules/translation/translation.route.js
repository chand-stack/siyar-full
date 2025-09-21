"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const translation_controller_1 = __importDefault(require("./translation.controller"));
const router = (0, express_1.Router)();
const translationController = new translation_controller_1.default();
// Health check endpoint
router.get('/health', translationController.health.bind(translationController));
// Single translation endpoint
router.post('/', translationController.translateSingle.bind(translationController));
// Batch translation endpoint
router.post('/batch', translationController.translateBatch.bind(translationController));
// Get supported languages
router.get('/languages', translationController.getSupportedLanguages.bind(translationController));
exports.default = router;
