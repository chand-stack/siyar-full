import { FilterQuery } from "mongoose";
import { IContact, ContactStatus } from "./contact.interface";
import { Contact } from "./contact.model";

const createContact = async(payload: Partial<IContact>)=>{
    const contactInfo = await Contact.create(payload)
    return contactInfo
}

const getAllContacts = async(filter: FilterQuery<IContact> = {}, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [contacts, total] = await Promise.all([
        Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Contact.countDocuments(filter)
    ]);
    return { contacts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

const getContactById = async(id: string) => {
    return Contact.findById(id);
}

const updateContact = async(id: string, payload: Partial<IContact>) => {
    // Handle status-specific updates
    if (payload.status === "replied" && !payload.repliedAt) {
        payload.repliedAt = new Date();
    }
    if (payload.status === "closed" && !payload.closedAt) {
        payload.closedAt = new Date();
    }
    
    return Contact.findByIdAndUpdate(id, payload, { new: true });
}

const updateContactStatus = async(id: string, status: ContactStatus, adminNotes?: string) => {
    const updateData: any = { status };
    
    if (adminNotes) {
        updateData.adminNotes = adminNotes;
    }
    
    if (status === "replied") {
        updateData.repliedAt = new Date();
    }
    if (status === "closed") {
        updateData.closedAt = new Date();
    }
    
    return Contact.findByIdAndUpdate(id, updateData, { new: true });
}

const deleteContact = async(id: string) => {
    return Contact.findByIdAndDelete(id);
}

const getContactStats = async() => {
    const [total, newContacts, readContacts, repliedContacts, closedContacts, spamContacts] = await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ status: "new" }),
        Contact.countDocuments({ status: "read" }),
        Contact.countDocuments({ status: "replied" }),
        Contact.countDocuments({ status: "closed" }),
        Contact.countDocuments({ status: "spam" })
    ]);

    return {
        total,
        new: newContacts,
        read: readContacts,
        replied: repliedContacts,
        closed: closedContacts,
        spam: spamContacts
    };
}

const searchContacts = async(query: string, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const searchFilter = {
        $or: [
            { email: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
            { subject: { $regex: query, $options: 'i' } },
            { message: { $regex: query, $options: 'i' } }
        ]
    };
    
    const [contacts, total] = await Promise.all([
        Contact.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Contact.countDocuments(searchFilter)
    ]);
    
    return { contacts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export const ContactService = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    updateContactStatus,
    deleteContact,
    getContactStats,
    searchContacts
}