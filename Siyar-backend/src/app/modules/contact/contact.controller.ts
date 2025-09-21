import { NextFunction, Request, Response } from "express";
import { ContactService } from "./contact.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { ContactStatus } from "./contact.interface";

const createContact = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const contactInfo = await ContactService.createContact(req.body)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message:"Contact created successfully",
        data: contactInfo
    })
})

const getAllContacts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const { page = "1", limit = "20", status, search } = req.query as Record<string, string>;
    
    let filter: any = {};
    if (status) filter.status = status;
    
    let result;
    if (search) {
        result = await ContactService.searchContacts(search, Number(page), Number(limit));
    } else {
        result = await ContactService.getAllContacts(filter, Number(page), Number(limit));
    }

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message:"Contacts retrieved successfully",
        data: result
    })
})

const getContactById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const { id } = req.params;
    const contact = await ContactService.getContactById(id);

    if (!contact) {
        return sendResponse(res,{
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message:"Contact not found",
            data: null
        })
    }

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message:"Contact retrieved successfully",
        data: contact
    })
})

const updateContact = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const { id } = req.params;
    const updatedContact = await ContactService.updateContact(id, req.body);

    if (!updatedContact) {
        return sendResponse(res,{
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message:"Contact not found",
            data: null
        })
    }

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message:"Contact updated successfully",
        data: updatedContact
    })
})

const updateContactStatus = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !["new", "read", "replied", "closed", "spam"].includes(status)) {
        return sendResponse(res,{
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message:"Invalid status. Must be one of: new, read, replied, closed, spam",
            data: null
        })
    }

    const updatedContact = await ContactService.updateContactStatus(id, status as ContactStatus, adminNotes);

    if (!updatedContact) {
        return sendResponse(res,{
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message:"Contact not found",
            data: null
        })
    }

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message:"Contact status updated successfully",
        data: updatedContact
    })
})

const deleteContact = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const { id } = req.params;
    const deletedContact = await ContactService.deleteContact(id);

    if (!deletedContact) {
        return sendResponse(res,{
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message:"Contact not found",
            data: null
        })
    }

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message:"Contact deleted successfully",
        data: deletedContact
    })
})

const getContactStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const stats = await ContactService.getContactStats();

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message:"Contact statistics retrieved successfully",
        data: stats
    })
})

export const ContactController = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    updateContactStatus,
    deleteContact,
    getContactStats
}