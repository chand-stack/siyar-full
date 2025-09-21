export type ContactStatus = "new" | "read" | "replied" | "closed" | "spam";

export interface IContact{
    email: string;
    name?: string;
    subject?: string;
    message?: string;
    status: ContactStatus;
    adminNotes?: string;
    repliedAt?: Date;
    closedAt?: Date;
}