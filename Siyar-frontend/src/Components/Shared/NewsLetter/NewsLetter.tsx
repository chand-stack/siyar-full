import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import newsLetterImg from '../../../assets/newsletter-icon.png';
import { useSubscribeToNewsletterMutation } from '../../../Redux/api/newsletterApi';
import Swal from 'sweetalert2';

const NewsLetter = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [subscribeToNewsletter, { isLoading }] = useSubscribeToNewsletterMutation();

    // Function to get font class based on language
    const getFontClass = (language: string) => {
        switch (language) {
            case 'ar': return 'font-cairo';
            case 'id': return 'font-cairo';
            case 'tr': return 'font-roboto';
            default: return 'font-cairo';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Email Required',
                text: 'Please enter your email address',
                confirmButtonColor: '#0054FF',
                background: '#1a1a1a',
                color: '#ffffff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address',
                confirmButtonColor: '#0054FF',
                background: '#1a1a1a',
                color: '#ffffff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        try {
            await subscribeToNewsletter({
                email: email.trim(),
                firstName: 'Newsletter', // Default name as requested
                lastName: 'Subscriber',
                source: 'newsletter-section'
            }).unwrap();
            
            setEmail('');
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Successfully subscribed to newsletter!',
                confirmButtonColor: '#0054FF',
                background: '#1a1a1a',
                color: '#ffffff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        } catch (error: unknown) {
            console.error('Newsletter subscription error:', error);
            
            // Handle specific error messages
            let errorMessage = 'Failed to subscribe. Please try again.';
            
            if (error && typeof error === 'object' && 'data' in error) {
                const errorData = error as { data?: { message?: string } };
                if (errorData.data?.message) {
                    errorMessage = errorData.data.message;
                }
            } else if (error && typeof error === 'object' && 'message' in error) {
                const errorMessageObj = error as { message: string };
                errorMessage = errorMessageObj.message;
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Subscription Failed',
                text: errorMessage,
                confirmButtonColor: '#0054FF',
                background: '#1a1a1a',
                color: '#ffffff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
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
        <div className="bg-white py-16">
            {/* Top Border */}
            <div className="w-full h-px bg-[#03045E] mb-16"></div>
            
            <div className="container mx-auto px-6">
                <motion.div 
                    className="max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Right Side - Illustration (Top on mobile) */}
                        <motion.div 
                            className="order-1 lg:order-2 flex justify-center lg:justify-end"
                            variants={itemVariants}
                        >
                            <div className="relative">
                                {/* Envelope Background */}
                           <img src={newsLetterImg} alt="" />
                            </div>
                        </motion.div>

                        {/* Left Side - Content and Form (Bottom on mobile) */}
                        <motion.div 
                            className="order-2 lg:order-1"
                            variants={itemVariants}
                        >
                            <div className="space-y-6">
                                {/* Heading */}
                                <h2 className={`text-xl font-bold text-[#03045E] uppercase tracking-wide ${getFontClass(i18n.language)}`}>
                                    {t('newsletter.title')}
                                </h2>
                                
                                {/* Description */}
                                <p className={`text-lg text-black leading-relaxed ${getFontClass(i18n.language)}`}>
                                    {t('newsletter.description')}
                                </p>
                                
                                {/* Email Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('newsletter.emailPlaceholder')}
                                            className={`w-full px-5 py-4 text-lg bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054FF] focus:border-transparent placeholder-gray-500 ${getFontClass(i18n.language)}`}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`btn h-14 bg-[#0054FF] hover:bg-[#0044CC] text-white font-semibold text-xl rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getFontClass(i18n.language)}`}
                                        >
                                            {isLoading ? 'Subscribing...' : (t('newsletter.subscribe') || 'Subscribe')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NewsLetter;