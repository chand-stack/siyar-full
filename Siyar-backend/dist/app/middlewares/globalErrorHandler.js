"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
// import { handlerDuplicateError } from "../helpers/handleDuplicateError";
const handleCastError_1 = require("../helpers/handleCastError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const handlerDuplicateError_1 = require("../helpers/handlerDuplicateError");
const globalErrorHandler = (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    let errorSources = [];
    let statusCode = 500;
    let message = "something went wrong!!";
    // Payload too large error
    if (err.type === 'entity.too.large' || err.status === 413) {
        statusCode = 413;
        message = "Request payload is too large. Please reduce the content size.";
        errorSources = [{
                path: 'content',
                message: 'Content exceeds maximum allowed size. HTML content should be under 10MB and plain text under 5MB.'
            }];
    }
    // Duplicate Error
    else if (err.code === 11000) {
        const simplifiedError = (0, handlerDuplicateError_1.handlerDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object Id Error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod Error
    // else if(err.name === "ZodError"){
    //   const simplifiedError = handlerZodError(err)
    //   statusCode= simplifiedError.statusCode
    //   message = simplifiedError.message
    //   errorSources = simplifiedError.errorSources as TErrorSources[]
    // }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handlerValidationError_1.handlerValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
