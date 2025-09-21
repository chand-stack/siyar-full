import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGetLatestArticlesQuery } from '../../../../Redux/api/articleApi';
import { googleTranslationService, type SupportedLanguage } from '../../../../services/googleTranslationService';

const LatestSection: React.FC = () => {
	const { t, i18n } = useTranslation();
	
	// Fetch latest articles from API
	const { data: articlesData, isLoading: articlesLoading } = useGetLatestArticlesQuery({
		limit: 10 // Fetch more to ensure we have enough latest articles
	});

	// Get first 2 latest articles
	const latestArticles = React.useMemo(() => 
		articlesData?.data?.items?.slice(0, 2) || [], 
		[articlesData?.data?.items]
	);

	// Translation state
	const [isTranslating, setIsTranslating] = React.useState(false);
	
	// Type for translated articles
	type TranslatedArticle = {
		_id: string;
		title: string;
		subtitle?: string;
		author: string;
		translatedTitle: string;
		translatedSubtitle?: string;
		translatedAuthor: string;
		slug: string;
		featuredImage: {
			url: string;
			alt?: string;
		};
		[key: string]: unknown;
	};
	
	const [translatedArticles, setTranslatedArticles] = React.useState<TranslatedArticle[]>([]);

	const isLoading = articlesLoading || isTranslating;

	// Function to get font class based on language
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar': return 'font-cairo';
			case 'id': return 'font-cairo';
			case 'tr': return 'font-roboto';
			default: return 'font-cairo';
		}
	};

	// Effect to translate articles when data or language changes
	React.useEffect(() => {
		const translateArticles = async () => {
			if (latestArticles.length > 0) {
				console.log(`🔄 Starting latest articles translation to: ${i18n.language}`);
				console.log(`📋 Latest articles to translate:`, latestArticles.map(a => ({ title: a.title, subtitle: a.subtitle, author: a.author })));
				
				setIsTranslating(true);
				
				try {
					// Extract all texts to translate (title, subtitle, author)
					const allTexts = latestArticles.reduce((acc, article) => {
						acc.push(article.title);
						if (article.subtitle) acc.push(article.subtitle);
						acc.push(article.author);
						return acc;
					}, [] as string[]);
					
					// Use batch translation for better performance
					const currentLanguage = i18n.language as SupportedLanguage;
					
					console.log(`🌐 Translating ${allTexts.length} latest article texts to ${currentLanguage}`);
					const translatedTexts = await googleTranslationService.translateBatch(allTexts, currentLanguage);
					
					console.log(`✅ Latest articles translation results:`, translatedTexts);
					
					// Map translated texts back to articles
					let textIndex = 0;
					const translated = latestArticles.map((article) => {
						const translatedTitle = translatedTexts[textIndex++] || article.title;
						const translatedSubtitle = article.subtitle ? (translatedTexts[textIndex++] || article.subtitle) : undefined;
						const translatedAuthor = translatedTexts[textIndex++] || article.author;
						
						return {
							...article,
							translatedTitle,
							translatedSubtitle,
							translatedAuthor
						};
					});
					
					setTranslatedArticles(translated);
					console.log(`🎯 Latest articles translation completed successfully`);
				} catch (error) {
					console.error('❌ Failed to translate latest articles:', error);
					// Fallback to original content
					const fallback = latestArticles.map(article => ({
						...article,
						translatedTitle: article.title,
						translatedSubtitle: article.subtitle,
						translatedAuthor: article.author
					}));
					setTranslatedArticles(fallback);
				} finally {
					setIsTranslating(false);
				}
			}
		};

		translateArticles();
	}, [latestArticles, i18n.language]);

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

	if (isLoading) {
		return (
			<section className="w-full bg-white py-10 md:py-14">
				<div className="container mx-auto px-6">
									<motion.h3 
					className={`uppercase tracking-wider text-sm font-semibold text-gray-800 mb-6 ${getFontClass(i18n.language)}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{t('home.latest.title')}
				</motion.h3>

				{/* Desktop layout loading */}
				<motion.div 
					className="hidden lg:block"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<div className="grid grid-cols-2 gap-12 items-start">
						{Array.from({ length: 2 }).map((_, index) => (
							<motion.div key={index} className="flex gap-6 items-start animate-pulse" variants={itemVariants}>
								<div className="w-[260px] h-[200px] bg-gray-200 rounded-2xl"></div>
								<div className="flex-1">
									<div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
									<div className="w-3/4 h-6 bg-gray-200 rounded"></div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

									{/* Mobile / Tablet layout loading */}
				<motion.div 
					className="lg:hidden space-y-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{Array.from({ length: 2 }).map((_, index) => (
						<motion.div key={index} className="flex gap-5 items-start animate-pulse" variants={itemVariants}>
							<div className="w-[200px] h-[150px] bg-gray-200 rounded-2xl"></div>
							<div className="flex-1">
								<div className="w-full h-7 bg-gray-200 rounded mb-2"></div>
								<div className="w-3/4 h-5 bg-gray-200 rounded"></div>
							</div>
						</motion.div>
					))}
				</motion.div>
				</div>
			</section>
		);
	}

	return (
		// latest section is only two cards which are latest articles
		<section className="w-full bg-white py-10 md:py-14">
			<div className="container mx-auto px-6">
				<motion.h3 
					className={`uppercase tracking-wider text-sm font-semibold text-gray-800 mb-6 ${getFontClass(i18n.language)}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{t('home.latest.title')}
				</motion.h3>

				{/* Desktop layout */}
				<motion.div 
					className="hidden lg:block"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<div className="grid grid-cols-2 gap-12 items-start">
						{(translatedArticles.length > 0 ? translatedArticles : latestArticles).map((article) => (
							<motion.div key={article._id} variants={itemVariants}>
								<Link to={`/article/${article.slug}`} className="flex gap-6 items-start cursor-pointer hover:opacity-90 transition-opacity">
									<img 
										src={article.featuredImage.url} 
										alt={article.featuredImage.alt || article.title} 
										className="w-[260px] h-[200px] object-cover rounded-2xl" 
									/>
									<div>
										<h4 className={`text-[34px] leading-tight font-extrabold text-black mb-2 ${getFontClass(i18n.language)}`}>
											{'translatedTitle' in article ? article.translatedTitle : article.title}
										</h4>
										{article.subtitle && (
											<p className={`text-lg text-gray-800 ${getFontClass(i18n.language)}`}>
												{'translatedSubtitle' in article ? (article.translatedSubtitle || article.subtitle) : article.subtitle}
											</p>
										)}
									</div>
								</Link>
							</motion.div>
						))}
					</div>

					{/* Desktop View archive button */}
					<motion.div 
						className="pt-8 flex justify-center"
						variants={itemVariants}
					>
						<Link 
							to="/articles"
							className={`inline-flex items-center justify-center whitespace-nowrap bg-white text-[#1f2937] border-2 border-[#f1cc57] rounded-xl h-12 px-8 text-lg font-semibold hover:bg-[#f1cc57] hover:text-[#1f2937] transition-colors duration-200 ${getFontClass(i18n.language)}`}
						>
							{t('common.seeAll')}
						</Link>
					</motion.div>
				</motion.div>

				{/* Mobile / Tablet layout */}
				<motion.div 
					className="lg:hidden space-y-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{(translatedArticles.length > 0 ? translatedArticles : latestArticles).map((article) => (
						<motion.div key={article._id} variants={itemVariants}>
							<Link to={`/article/${article.slug}`} className="flex gap-5 items-start cursor-pointer hover:opacity-90 transition-opacity">
								<img 
									src={article.featuredImage.url} 
									alt={article.featuredImage.alt || article.title} 
									className="w-[200px] h-[150px] object-cover rounded-2xl" 
								/>
								<div>
									<h4 className={`text-[28px] leading-tight font-extrabold text-black mb-2 ${getFontClass(i18n.language)}`}>
										{'translatedTitle' in article ? article.translatedTitle : article.title}
									</h4>
									{article.subtitle && (
										<p className={`text-lg text-gray-800 ${getFontClass(i18n.language)}`}>
											{'translatedSubtitle' in article ? (article.translatedSubtitle || article.subtitle) : article.subtitle}
										</p>
									)}
								</div>
							</Link>
						</motion.div>
					))}

					<motion.div 
						className="pt-6 flex justify-center"
						variants={itemVariants}
					>
						<Link 
							to="/articles"
							className={`inline-flex items-center justify-center whitespace-nowrap bg-white text-[#1f2937] border-2 border-[#f1cc57] rounded-xl h-14 px-10 text-xl font-semibold hover:bg-[#f1cc57] hover:text-[#1f2937] transition-colors duration-200 ${getFontClass(i18n.language)}`}
						>
							{t('common.seeAll')}
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default LatestSection;
