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
exports.TranslationController = void 0;
const google_translate_api_x_1 = __importDefault(require("google-translate-api-x"));
const env_1 = require("../../config/env");
class TranslationController {
    // Health check endpoint
    health(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                success: true,
                status: 'OK',
                message: 'Translation service is running'
            });
        });
    }
    // Single translation endpoint
    translateSingle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { text, to, from = 'auto' } = req.body;
                if (!text || !to) {
                    res.status(400).json({
                        success: false,
                        error: 'Missing required fields: text and to'
                    });
                    return;
                }
                console.log(`Translating: "${text}" from ${from} to ${to}`);
                const result = yield (0, google_translate_api_x_1.default)(text, {
                    from,
                    to
                });
                res.status(200).json({
                    success: true,
                    data: {
                        text: result.text,
                        from: ((_b = (_a = result.from) === null || _a === void 0 ? void 0 : _a.language) === null || _b === void 0 ? void 0 : _b.iso) || from,
                        to: to,
                        original: text
                    }
                });
            }
            catch (error) {
                console.error('Translation error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Translation failed',
                    message: error.message,
                    details: env_1.envVars.NODE_ENV === 'development' ? error.stack : undefined
                });
            }
        });
    }
    // Batch translation endpoint
    translateBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { texts, to, from = 'auto' } = req.body;
                if (!texts || !Array.isArray(texts) || !to) {
                    res.status(400).json({
                        success: false,
                        error: 'Missing required fields: texts (array) and to'
                    });
                    return;
                }
                console.log(`Batch translating ${texts.length} texts from ${from} to ${to}`);
                const results = yield (0, google_translate_api_x_1.default)(texts, {
                    from,
                    to
                });
                // Handle both single result and array results
                const translatedTexts = Array.isArray(results)
                    ? results.map((r) => r.text)
                    : [results.text];
                res.status(200).json({
                    success: true,
                    data: {
                        translations: translatedTexts,
                        from: from,
                        to: to,
                        originals: texts,
                        count: texts.length
                    }
                });
            }
            catch (error) {
                console.error('Batch translation error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Batch translation failed',
                    message: error.message,
                    details: env_1.envVars.NODE_ENV === 'development' ? error.stack : undefined
                });
            }
        });
    }
    // Get supported languages (static list of common languages)
    getSupportedLanguages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const supportedLanguages = {
                'af': 'Afrikaans',
                'sq': 'Albanian',
                'ar': 'Arabic',
                'hy': 'Armenian',
                'az': 'Azerbaijani',
                'eu': 'Basque',
                'be': 'Belarusian',
                'bn': 'Bengali',
                'bs': 'Bosnian',
                'bg': 'Bulgarian',
                'ca': 'Catalan',
                'ceb': 'Cebuano',
                'zh': 'Chinese',
                'zh-cn': 'Chinese (Simplified)',
                'zh-tw': 'Chinese (Traditional)',
                'co': 'Corsican',
                'hr': 'Croatian',
                'cs': 'Czech',
                'da': 'Danish',
                'nl': 'Dutch',
                'en': 'English',
                'eo': 'Esperanto',
                'et': 'Estonian',
                'fi': 'Finnish',
                'fr': 'French',
                'fy': 'Frisian',
                'gl': 'Galician',
                'ka': 'Georgian',
                'de': 'German',
                'el': 'Greek',
                'gu': 'Gujarati',
                'ht': 'Haitian Creole',
                'ha': 'Hausa',
                'haw': 'Hawaiian',
                'he': 'Hebrew',
                'hi': 'Hindi',
                'hmn': 'Hmong',
                'hu': 'Hungarian',
                'is': 'Icelandic',
                'ig': 'Igbo',
                'id': 'Indonesian',
                'ga': 'Irish',
                'it': 'Italian',
                'ja': 'Japanese',
                'jw': 'Javanese',
                'kn': 'Kannada',
                'kk': 'Kazakh',
                'km': 'Khmer',
                'rw': 'Kinyarwanda',
                'ko': 'Korean',
                'ku': 'Kurdish',
                'ky': 'Kyrgyz',
                'lo': 'Lao',
                'la': 'Latin',
                'lv': 'Latvian',
                'lt': 'Lithuanian',
                'lb': 'Luxembourgish',
                'mk': 'Macedonian',
                'mg': 'Malagasy',
                'ms': 'Malay',
                'ml': 'Malayalam',
                'mt': 'Maltese',
                'mi': 'Maori',
                'mr': 'Marathi',
                'mn': 'Mongolian',
                'my': 'Myanmar (Burmese)',
                'ne': 'Nepali',
                'no': 'Norwegian',
                'ny': 'Nyanja (Chichewa)',
                'or': 'Odia (Oriya)',
                'ps': 'Pashto',
                'fa': 'Persian',
                'pl': 'Polish',
                'pt': 'Portuguese',
                'pa': 'Punjabi',
                'ro': 'Romanian',
                'ru': 'Russian',
                'sm': 'Samoan',
                'gd': 'Scots Gaelic',
                'sr': 'Serbian',
                'st': 'Sesotho',
                'sn': 'Shona',
                'sd': 'Sindhi',
                'si': 'Sinhala (Sinhalese)',
                'sk': 'Slovak',
                'sl': 'Slovenian',
                'so': 'Somali',
                'es': 'Spanish',
                'su': 'Sundanese',
                'sw': 'Swahili',
                'sv': 'Swedish',
                'tl': 'Tagalog (Filipino)',
                'tg': 'Tajik',
                'ta': 'Tamil',
                'tt': 'Tatar',
                'te': 'Telugu',
                'th': 'Thai',
                'tr': 'Turkish',
                'tk': 'Turkmen',
                'uk': 'Ukrainian',
                'ur': 'Urdu',
                'ug': 'Uyghur',
                'uz': 'Uzbek',
                'vi': 'Vietnamese',
                'cy': 'Welsh',
                'xh': 'Xhosa',
                'yi': 'Yiddish',
                'yo': 'Yoruba',
                'zu': 'Zulu'
            };
            res.status(200).json({
                success: true,
                data: {
                    languages: supportedLanguages,
                    count: Object.keys(supportedLanguages).length
                }
            });
        });
    }
}
exports.TranslationController = TranslationController;
exports.default = TranslationController;
