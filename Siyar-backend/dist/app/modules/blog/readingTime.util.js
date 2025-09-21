"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateReadingTimeInMinutes = estimateReadingTimeInMinutes;
function estimateReadingTimeInMinutes(plainText) {
    const words = (plainText === null || plainText === void 0 ? void 0 : plainText.trim().split(/\s+/).filter(Boolean).length) || 0;
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}
