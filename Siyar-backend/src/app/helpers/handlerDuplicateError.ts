/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
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