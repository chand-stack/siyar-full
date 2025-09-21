import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import NewsLetter from '../../Shared/NewsLetter/NewsLetter';
import bg from "../../../assets/banner-bg.png"
import FollowSocialBanner from '../../Shared/FollowSocialBanner/FollowSocialBanner';
import { useCreateContactMutation } from '../../../Redux/api/contactApi';
const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [createContact, { isLoading }] = useCreateContactMutation();
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  // Function to get font class based on language
  const getFontClass = (language: string) => {
    switch (language) {
      case 'ar': return 'font-cairo';
      case 'id': return 'font-cairo';
      case 'tr': return 'font-roboto';
      default: return 'font-cairo';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a hidden form for FormSubmit.co email notification
      const emailForm = document.createElement('form');
      emailForm.action = 'https://formsubmit.co/Admin@siyarinstitute.org';
      emailForm.method = 'POST';
      emailForm.style.display = 'none';
      
      // Add form data for email notification
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = formData.email;
      
      const subjectInput = document.createElement('input');
      subjectInput.type = 'hidden';
      subjectInput.name = 'subject';
      subjectInput.value = `New Contact Form Submission: ${formData.subject}`;
      
      const messageInput = document.createElement('input');
      messageInput.type = 'hidden';
      messageInput.name = 'message';
      messageInput.value = `New contact form submission from Siyar Institute website:

From: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from the Siyar Institute contact form.`;
      
      // Add FormSubmit.co configuration
      const redirectInput = document.createElement('input');
      redirectInput.type = 'hidden';
      redirectInput.name = '_next';
      redirectInput.value = window.location.origin + '/contact?success=true';
      
      const captchaInput = document.createElement('input');
      captchaInput.type = 'hidden';
      captchaInput.name = '_captcha';
      captchaInput.value = 'false';
      
      const templateInput = document.createElement('input');
      templateInput.type = 'hidden';
      templateInput.name = '_template';
      templateInput.value = 'table';
      
      // Append all inputs to form
      emailForm.appendChild(emailInput);
      emailForm.appendChild(subjectInput);
      emailForm.appendChild(messageInput);
      emailForm.appendChild(redirectInput);
      emailForm.appendChild(captchaInput);
      emailForm.appendChild(templateInput);
      
      // Submit both operations simultaneously
      await Promise.all([
        createContact(formData).unwrap(),
        new Promise((resolve) => {
          // Submit email form
          document.body.appendChild(emailForm);
          emailForm.submit();
          
          // Clean up after a short delay
          setTimeout(() => {
            document.body.removeChild(emailForm);
            resolve(true);
          }, 1000);
        })
      ]);
      
      // Show success notification
      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully. We will get back to you soon!',
        icon: 'success',
        confirmButtonColor: '#03045E',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'font-cairo',
          title: 'font-cairo'
        }
      });

      // Reset form
      setFormData({
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: unknown) {
      // Show error notification
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Something went wrong. Please try again.';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'font-cairo',
          title: 'font-cairo'
        }
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
         <div
      className="w-full min-h-[20vh] bg-[#03045E]"
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%"
      }}
    ></div>
      <div className="container mx-auto px-6 py-16">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Contact Form Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
            variants={itemVariants}
          >
            {/* Left Side - Content */}
            <div className="order-1 lg:order-1">
              <div className="space-y-6">
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black ${getFontClass(i18n.language)}`}>
                  {t('nav.contact')}
                </h2>
                <p className={`text-xl md:text-2xl text-gray-600 leading-relaxed font-semibold ${getFontClass(i18n.language)}`}>
                  Have a question for us? Or something you want to let us know? Fill in the form below and we'll get back to you as soon as possible.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="order-2 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.email')}
                    className={`w-full px-6 py-4 text-lg bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 ${getFontClass(i18n.language)}`}
                    required
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.subject')}
                    className={`w-full px-6 py-4 text-lg bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 ${getFontClass(i18n.language)}`}
                    required
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.message')}
                    rows={6}
                    className={`w-full px-6 py-4 text-lg bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 resize-none ${getFontClass(i18n.language)}`}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn h-14 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-semibold text-lg rounded-lg transition-colors duration-200 ${getFontClass(i18n.language)}`}
                  >
                    {isLoading ? 'Sending...' : t('contact.form.sendEnquiry')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
        <NewsLetter />
      </div>
      <FollowSocialBanner />
    </div>
  );
};

export default Contact;
