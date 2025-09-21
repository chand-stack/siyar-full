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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_model_1 = require("./contact.model");
const createContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const contactInfo = yield contact_model_1.Contact.create(payload);
    return contactInfo;
});
const getAllContacts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [contacts, total] = yield Promise.all([
        contact_model_1.Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        contact_model_1.Contact.countDocuments(filter)
    ]);
    return { contacts, total, page, limit, totalPages: Math.ceil(total / limit) };
});
const getContactById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return contact_model_1.Contact.findById(id);
});
const updateContact = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle status-specific updates
    if (payload.status === "replied" && !payload.repliedAt) {
        payload.repliedAt = new Date();
    }
    if (payload.status === "closed" && !payload.closedAt) {
        payload.closedAt = new Date();
    }
    return contact_model_1.Contact.findByIdAndUpdate(id, payload, { new: true });
});
const updateContactStatus = (id, status, adminNotes) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = { status };
    if (adminNotes) {
        updateData.adminNotes = adminNotes;
    }
    if (status === "replied") {
        updateData.repliedAt = new Date();
    }
    if (status === "closed") {
        updateData.closedAt = new Date();
    }
    return contact_model_1.Contact.findByIdAndUpdate(id, updateData, { new: true });
});
const deleteContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return contact_model_1.Contact.findByIdAndDelete(id);
});
const getContactStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [total, newContacts, readContacts, repliedContacts, closedContacts, spamContacts] = yield Promise.all([
        contact_model_1.Contact.countDocuments(),
        contact_model_1.Contact.countDocuments({ status: "new" }),
        contact_model_1.Contact.countDocuments({ status: "read" }),
        contact_model_1.Contact.countDocuments({ status: "replied" }),
        contact_model_1.Contact.countDocuments({ status: "closed" }),
        contact_model_1.Contact.countDocuments({ status: "spam" })
    ]);
    return {
        total,
        new: newContacts,
        read: readContacts,
        replied: repliedContacts,
        closed: closedContacts,
        spam: spamContacts
    };
});
const searchContacts = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const searchFilter = {
        $or: [
            { email: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
            { subject: { $regex: query, $options: 'i' } },
            { message: { $regex: query, $options: 'i' } }
        ]
    };
    const [contacts, total] = yield Promise.all([
        contact_model_1.Contact.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        contact_model_1.Contact.countDocuments(searchFilter)
    ]);
    return { contacts, total, page, limit, totalPages: Math.ceil(total / limit) };
});
exports.ContactService = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    updateContactStatus,
    deleteContact,
    getContactStats,
    searchContacts
};
