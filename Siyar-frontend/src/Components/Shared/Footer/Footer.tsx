import React, { useState } from 'react';
import { Link } from 'react-router';
import footerEn from '../../../assets/footerBrand-en.png';
import footerAr from '../../../assets/footerBrand-arab.png';
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube, FaTiktok } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSubscribeToNewsletterMutation } from '../../../Redux/api/newsletterApi';
import Swal from 'sweetalert2';

const Footer: React.FC = () => {
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

	// Function to get footer logo based on language
	const getFooterLogo = () => {
		switch (i18n.language) {
			case 'ar':
				return footerAr;
			default:
				return footerEn; // For English, Turkish, and Indonesian
		}
	};

	// Newsletter subscription handler
	const handleNewsletterSubscription = async (e: React.FormEvent) => {
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
				source: 'website'
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
		<footer id="footer" className="w-full bg-black text-white py-10 md:py-14">
			<motion.div 
				className="container mx-auto px-6"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Desktop layout */}
				<motion.div className="hidden lg:grid grid-cols-3 gap-12 items-start" variants={itemVariants}>
					{/* Left: Combined logo + text image */}
					<div className="">
						<img src={getFooterLogo()} alt="Siyar footer" className="w-52 h-auto" />
						<div className="mt-6 flex items-center gap-5 text-2xl">
							<a aria-label="x" href="https://x.com/Siyarinstitute" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
							<a aria-label="instagram" href="https://www.instagram.com/siyarinstitute" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
							<a aria-label="tiktok" href="https://www.tiktok.com/@siyarinstitute" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
							<a aria-label="youtube" href="http://www.youtube.com/@siyarinstitute" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
							<a aria-label="facebook" href="https://www.facebook.com/profile.php?id=61579279420778" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
						</div>
					</div>

					{/* Middle: email input */}
					<motion.div className="" variants={itemVariants}>
						<form onSubmit={handleNewsletterSubscription} className="flex w-full">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder={t('footer.newsletter.placeholder')}
								className={`w-full h-14 px-5 bg-white text-black placeholder:text-gray-500 outline-none ${getFontClass(i18n.language)}`}
								disabled={isLoading}
							/>
							<button 
								type="submit"
								disabled={isLoading}
								className={`h-14 px-8 bg-[#0054FF] text-white text-lg ${getFontClass(i18n.language)} disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0044CC] transition-colors`}
							>
								{isLoading ? 'Subscribing...' : 'Subscribe'}
							</button>
						</form>
					</motion.div>

					{/* Right: links (3 columns) */}
					<motion.div className={`text-lg space-y-6n grid grid-cols-2 ${getFontClass(i18n.language)}`} variants={itemVariants}>
						<ul className="space-y-6">
							<li><Link to="/about" className="hover:text-blue-400 transition-colors duration-200">{t('nav.about')}</Link></li>
							<li><a href="#" className="hover:text-blue-400 transition-colors duration-200">{t('footer.supportUs')}</a></li>
							<li><a href="#" className="hover:text-blue-400 transition-colors duration-200">{t('footer.jobs')}</a></li>
						</ul>
						<ul className="space-y-6">
							<li><Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">{t('nav.contact')}</Link></li>
							<li><Link to="/policies" className="hover:text-blue-400 transition-colors duration-200">{t('footer.policies')}</Link></li>
							<li><Link to="/terms-of-use" className="hover:text-blue-400 transition-colors duration-200">{t('footer.termsOfUse')}</Link></li>
							<li><Link to="/privacy" className="hover:text-blue-400 transition-colors duration-200">{t('footer.privacy')}</Link></li>
						</ul>
					</motion.div>
				</motion.div>

				{/* Mobile layout */}
				<motion.div className="lg:hidden" variants={itemVariants}>
					<motion.div className="max-w-[420px]" variants={itemVariants}>
						<img src={getFooterLogo()} alt="Siyar footer" className="w-full h-auto" />
					</motion.div>

					<form onSubmit={handleNewsletterSubscription} className="mt-6">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={t('footer.newsletter.placeholder')}
							className={`w-full h-14 px-5 bg-white text-black placeholder:text-gray-500 outline-none rounded mb-3 ${getFontClass(i18n.language)}`}
							disabled={isLoading}
						/>
						<motion.button 
							type="submit"
							disabled={isLoading}
							className={`w-full h-14 bg-[#0054FF] text-white text-xl font-semibold rounded ${getFontClass(i18n.language)} disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0044CC] transition-colors`}
							variants={itemVariants}
						>
							{isLoading ? 'Subscribing...' : 'Subscribe'}
						</motion.button>
					</form>

					<motion.div 
						className={`mt-8 grid grid-cols-2 gap-6 text-2xl ${getFontClass(i18n.language)}`}
						variants={itemVariants}
					>
						<Link to="/about" className="hover:text-blue-400 transition-colors duration-200">{t('nav.about')}</Link>
						<Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">{t('nav.contact')}</Link>
						<a href="#" className="hover:text-blue-400 transition-colors duration-200">{t('footer.supportUs')}</a>
						<Link to="/policies" className="hover:text-blue-400 transition-colors duration-200">{t('footer.policies')}</Link>
						<a href="#" className="hover:text-blue-400 transition-colors duration-200">{t('footer.jobs')}</a>
						<Link to="/terms-of-use" className="hover:text-blue-400 transition-colors duration-200">{t('footer.termsOfUse')}</Link>
						<Link to="/privacy" className="hover:text-blue-400 transition-colors duration-200">{t('footer.privacy')}</Link>
					</motion.div>

					<motion.div 
						className="mt-10 flex items-center gap-6 text-3xl"
						variants={itemVariants}
					>
						<a aria-label="x" href="https://x.com/Siyarinstitute" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
						<a aria-label="instagram" href="https://www.instagram.com/siyarinstitute" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
						<a aria-label="tiktok" href="https://www.tiktok.com/@siyarinstitute" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
						<a aria-label="youtube" href="http://www.youtube.com/@siyarinstitute" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
						<a aria-label="facebook" href="https://www.facebook.com/profile.php?id=61579279420778" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
					</motion.div>
				</motion.div>
			</motion.div>
		</footer>
	);
};

export default Footer;