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
exports.translateHtmlWithOpenAI = translateHtmlWithOpenAI;
exports.translateTextWithOpenAI = translateTextWithOpenAI;
const openai_1 = __importDefault(require("openai"));
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new openai_1.default({ apiKey: openaiApiKey }) : null;
const languageNameMap = {
    en: "English",
    ar: "Arabic",
    id: "Bahasa Indonesia",
    tr: "Turkish"
};
function translateHtmlWithOpenAI(html, targetLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (!openai) {
            return html;
        }
        const targetName = (_a = languageNameMap[targetLanguage]) !== null && _a !== void 0 ? _a : targetLanguage;
        const system = `You are a professional translator. Translate the user's HTML content into ${targetName}.\n- Preserve all HTML tags and structure.\n- Only translate human-readable text.\n- Do not add explanations. Return only the translated HTML.`;
        const user = html;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system },
                { role: "user", content: user }
            ],
            temperature: 0.2,
        });
        const content = (_e = (_d = (_c = (_b = response.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) !== null && _e !== void 0 ? _e : html;
        return content;
    });
}
function translateTextWithOpenAI(text, targetLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (!openai) {
            return text;
        }
        const targetName = (_a = languageNameMap[targetLanguage]) !== null && _a !== void 0 ? _a : targetLanguage;
        const system = `You are a professional translator. Translate the user's text into ${targetName}. Return only the translated text.`;
        const response = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system },
                { role: "user", content: text }
            ],
            temperature: 0.2,
        });
        const content = (_e = (_d = (_c = (_b = response.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) !== null && _e !== void 0 ? _e : text;
        return content;
    });
}
