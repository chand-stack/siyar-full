import { Router } from 'express';
import TranslationController from './translation.controller';

const router = Router();
const translationController = new TranslationController();

// Health check endpoint
router.get('/health', translationController.health.bind(translationController));

// Single translation endpoint
router.post('/', translationController.translateSingle.bind(translationController));

// Batch translation endpoint
router.post('/batch', translationController.translateBatch.bind(translationController));

// Get supported languages
router.get('/languages', translationController.getSupportedLanguages.bind(translationController));

export default router;
