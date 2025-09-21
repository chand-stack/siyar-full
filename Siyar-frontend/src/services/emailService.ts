// Email service utility for frontend email-related operations
// Note: This is for frontend utilities only. Actual email sending is handled by the backend.

export interface EmailNotificationData {
  to: string;
  subject: string;
  message: string;
  contactInfo?: {
    name?: string;
    email: string;
    subject: string;
    message: string;
  };
}

export class EmailService {
  // Format contact form data for email notification
  static formatContactNotification(contactData: EmailNotificationData['contactInfo']): string {
    if (!contactData) return '';
    
    return `
New Contact Form Submission

Contact Details:
- Name: ${contactData.name || 'Not provided'}
- Email: ${contactData.email}
- Subject: ${contactData.subject}

Message:
${contactData.message}

---
This message was sent from the Siyar Institute contact form.
    `.trim();
  }

  // Generate email subject for contact notifications
  static generateContactSubject(contactData: EmailNotificationData['contactInfo']): string {
    if (!contactData) return 'New Contact Form Submission';
    
    return `New Contact: ${contactData.subject}`;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get admin email address
  static getAdminEmail(): string {
    return 'Admin@siyarinstitute.org';
  }

  // Format contact data for display in admin dashboard
  static formatContactForDisplay(contact: {
    email: string;
    name?: string;
    subject: string;
    message: string;
    createdAt: string;
  }): string {
    return `
Contact Form Submission
Date: ${new Date(contact.createdAt).toLocaleString()}
From: ${contact.name || 'Anonymous'} (${contact.email})
Subject: ${contact.subject}

Message:
${contact.message}
    `.trim();
  }
}

// Email templates for different types of notifications
export const EmailTemplates = {
  contactFormSubmission: (contactData: EmailNotificationData['contactInfo']) => ({
    subject: EmailService.generateContactSubject(contactData),
    body: EmailService.formatContactNotification(contactData),
    to: EmailService.getAdminEmail()
  }),

  contactFormConfirmation: (contactData: EmailNotificationData['contactInfo']) => ({
    subject: 'Thank you for contacting Siyar Institute',
    body: `
Dear ${contactData?.name || 'Valued Customer'},

Thank you for reaching out to Siyar Institute. We have received your message and will get back to you as soon as possible.

Your message details:
Subject: ${contactData?.subject}
Message: ${contactData?.message}

Best regards,
Siyar Institute Team
    `.trim(),
    to: contactData?.email || ''
  })
};

export default EmailService;
