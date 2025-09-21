import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Instagram: React.FC = () => {
	const { t, i18n } = useTranslation();

	// Function to get font class based on language
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar': return 'font-cairo';
			case 'id': return 'font-cairo';
			case 'tr': return 'font-roboto';
			default: return 'font-cairo';
		}
	};

	// Handle Instagram redirect
	const handleInstagramRedirect = () => {
		window.open('https://www.instagram.com/siyarinstitute', '_blank', 'noopener,noreferrer');
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const
			}
		}
	};

	return (
		<section className="w-full bg-white py-10 md:py-14">
			<div className="container mx-auto px-6">
				{/* hr line */}
				<div className="h-px bg-[#03045E]/20 mb-6" />
				<motion.h3 
					className={`uppercase tracking-wider text-sm font-semibold text-gray-800 mb-6 ${getFontClass(i18n.language)}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{t('home.instagram.title')}
				</motion.h3>

				{/* SnapWidget Instagram Feed with Instagram redirect overlay */}
				<motion.div 
					className="w-full flex justify-center relative"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{/* Responsive container with aspect ratio */}
					<div 
						className="relative w-full max-w-4xl"
						style={{
							aspectRatio: '765/510',
							minHeight: '300px'
						}}
					>
						{/* SnapWidget iframe */}
						<iframe 
							src="https://snapwidget.com/embed/1108105" 
							className="snapwidget-widget absolute inset-0 w-full h-full" 
							allowTransparency={true} 
							frameBorder="0" 
							scrolling="no" 
							style={{
								border: 'none',
								overflow: 'hidden',
								background: 'transparent'
							}} 
							title="Posts from Instagram"
						/>
						
						{/* Invisible overlay to capture clicks and redirect to Instagram */}
						<div 
							className="absolute inset-0 cursor-pointer z-10"
							onClick={handleInstagramRedirect}
							title="Visit our Instagram @siyarinstitute"
							style={{
								backgroundColor: 'transparent'
							}}
						/>
					</div>
				</motion.div>


				{/* Follow Button */}
				<motion.div 
					className="mt-8 flex md:justify-center"
					variants={containerVariants}
				>
					<a 
						href="https://www.instagram.com/siyarinstitute"
						target="_blank"
						rel="noopener noreferrer"
						className={`inline-flex items-center justify-center whitespace-nowrap bg-[#0054FF] hover:bg-[#0046d6] text-white rounded px-8 text-lg font-semibold h-[50px] w-[200px] ${getFontClass(i18n.language)} transition-colors duration-200`}
					>
						{t('home.instagram.follow')}
					</a>
				</motion.div>
			</div>
		</section>
	);
};

export default Instagram;
