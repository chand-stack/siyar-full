import { model, Schema } from "mongoose";
import { IContact, ContactStatus } from "./contact.interface";

const contactSchema = new Schema<IContact>({
email:{type:String, required:true, trim:true, lowercase:true},
name:{type:String, trim:true, maxlength:[100, 'Name cannot exceed 100 characters']},
subject:{type:String, trim:true, maxlength:[200, 'Subject cannot exceed 200 characters']},
message:{type:String, trim:true, maxlength:[2000, 'Message cannot exceed 2000 characters']},
status:{
    type:String,
    enum:["new", "read", "replied", "closed", "spam"],
    default:"new"
},
adminNotes:{type:String, trim:true, maxlength:[1000, 'Admin notes cannot exceed 1000 characters']},
repliedAt:{type:Date},
closedAt:{type:Date}
},{
    timestamps:true,
    versionKey:false
})

// Indexes for better performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });

export const Contact = model<IContact>("Contact", contactSchema)