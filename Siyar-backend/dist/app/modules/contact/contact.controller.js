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
exports.ContactController = void 0;
const contact_service_1 = require("./contact.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createContact = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const contactInfo = yield contact_service_1.ContactService.createContact(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Contact created successfully",
        data: contactInfo
    });
}));
const getAllContacts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", limit = "20", status, search } = req.query;
    let filter = {};
    if (status)
        filter.status = status;
    let result;
    if (search) {
        result = yield contact_service_1.ContactService.searchContacts(search, Number(page), Number(limit));
    }
    else {
        result = yield contact_service_1.ContactService.getAllContacts(filter, Number(page), Number(limit));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Contacts retrieved successfully",
        data: result
    });
}));
const getContactById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const contact = yield contact_service_1.ContactService.getContactById(id);
    if (!contact) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Contact not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Contact retrieved successfully",
        data: contact
    });
}));
const updateContact = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedContact = yield contact_service_1.ContactService.updateContact(id, req.body);
    if (!updatedContact) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Contact not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Contact updated successfully",
        data: updatedContact
    });
}));
const updateContactStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    if (!status || !["new", "read", "replied", "closed", "spam"].includes(status)) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Invalid status. Must be one of: new, read, replied, closed, spam",
            data: null
        });
    }
    const updatedContact = yield contact_service_1.ContactService.updateContactStatus(id, status, adminNotes);
    if (!updatedContact) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Contact not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Contact status updated successfully",
        data: updatedContact
    });
}));
const deleteContact = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedContact = yield contact_service_1.ContactService.deleteContact(id);
    if (!deletedContact) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Contact not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Contact deleted successfully",
        data: deletedContact
    });
}));
const getContactStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield contact_service_1.ContactService.getContactStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Contact statistics retrieved successfully",
        data: stats
    });
}));
exports.ContactController = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    updateContactStatus,
    deleteContact,
    getContactStats
};
