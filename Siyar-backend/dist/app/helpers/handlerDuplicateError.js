"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
const handlerDuplicateError = (err) => {
    // Handle cases where err.message might be null/undefined
    if (!err.message) {
        return {
            statusCode: 400,
            message: "Duplicate key error occurred"
        };
    }
    // Try to extract field name from error message
    const matchedArray = err.message.match(/"([^"]*)"/);
    if (matchedArray && matchedArray[1]) {
        return {
            statusCode: 400,
            message: `${matchedArray[1]} already exists!!`
        };
    }
    // Fallback for cases where we can't extract the field name
    return {
        statusCode: 400,
        message: "Duplicate key error occurred"
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
