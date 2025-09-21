import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGetArticlesQuery } from '../../../../Redux/api/articleApi';
import { googleTranslationService, type SupportedLanguage } from '../../../../services/googleTranslationService';

const Featured: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [isTranslating, setIsTranslating] = React.useState(false);
	
	// Fetch all articles from API
	const { data: articlesData, isLoading: articlesLoading } = useGetArticlesQuery({
		limit: 50, // Fetch more articles to ensure we get enough featured ones
		status: 'published',
		language: 'en'
	});

	// Filter articles to get only those with isFeatured: true, then take first 6
	const featuredArticles = React.useMemo(() => {
		const allArticles = articlesData?.data?.items || [];
		console.log('📋 All articles fetched:', allArticles.length);
		console.log('📋 Articles with isFeatured property:', allArticles.map(a => ({ title: a.title, isFeatured: a.isFeatured })));
		
		const filteredArticles = allArticles.filter(article => article.isFeatured === true);
		console.log('✅ Featured articles found:', filteredArticles.length);
		console.log('✅ Featured articles:', filteredArticles.map(a => a.title));
		
		return filteredArticles.slice(0, 6); // Take first 6 featured articles
	}, [articlesData?.data?.items]);

	const isLoading = articlesLoading || isTranslating;

	// State for translated articles
	const [translatedArticles, setTranslatedArticles] = React.useState<Array<{
		_id: string;
		title: string;
		author: string;
		translatedTitle: string;
		translatedAuthor: string;
		slug: string;
		featuredImage: {
			url: string;
			alt?: string;
		};
		[key: string]: unknown;
	}>>([]);

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
			if (featuredArticles.length > 0) {
				console.log(`🔄 Starting featured articles translation to: ${i18n.language}`);
				console.log(`📋 Articles to translate:`, featuredArticles.map(a => ({ title: a.title, author: a.author })));
				
				setIsTranslating(true);
				
				try {
					// Extract all titles and authors
					const allTexts = featuredArticles.reduce((acc, article) => {
						acc.push(article.title, article.author);
						return acc;
					}, [] as string[]);
					
					// Use batch translation for better performance
					const currentLanguage = i18n.language as SupportedLanguage;
					
					console.log(`🌐 Translating ${allTexts.length} article texts to ${currentLanguage}`);
					const translatedTexts = await googleTranslationService.translateBatch(allTexts, currentLanguage);
					
					console.log(`✅ Article translation results:`, translatedTexts);
					
					// Map translated texts back to articles (title, author pairs)
					const translated = featuredArticles.map((article, index) => {
						const titleIndex = index * 2;
						const authorIndex = index * 2 + 1;
						
						return {
							...article,
							translatedTitle: translatedTexts[titleIndex] || article.title,
							translatedAuthor: translatedTexts[authorIndex] || article.author
						};
					});
					
					setTranslatedArticles(translated);
					console.log(`🎯 Featured articles translation completed successfully`);
				} catch (error) {
					console.error('❌ Failed to translate featured articles:', error);
					// Fallback to original titles and authors
					const fallback = featuredArticles.map(article => ({
						...article,
						translatedTitle: article.title,
						translatedAuthor: article.author
					}));
					setTranslatedArticles(fallback);
				} finally {
					setIsTranslating(false);
				}
			}
		};

		translateArticles();
	}, [featuredArticles, i18n.language]);

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
			<section className="bg-white py-12">
				<div className="container mx-auto px-6">
					<motion.div 
						className="mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2 className={`text-xl md:text-2xl font-bold text-gray-800 tracking-wide ${getFontClass(i18n.language)}`}>
							{t('home.featured.title')}
						</h2>
					</motion.div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						{Array.from({ length: 6 }).map((_, index) => (
							<div key={index} className="animate-pulse">
								<div className="w-full h-72 md:h-96 lg:h-[460px] bg-gray-200 rounded-2xl"></div>
								<div className="pt-3 md:pt-4">
									<div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
									<div className="w-full h-8 bg-gray-200 rounded"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-white py-12">
			<div className="container mx-auto px-6">
				{/* Featured Section Header */}
				<motion.div 
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h2 className={`text-xl md:text-2xl font-bold text-gray-800 tracking-wide ${getFontClass(i18n.language)}`}>
						{t('home.featured.title')}
					</h2>
				</motion.div>

				{/* Featured Cards Grid - 6 featured articles */}
				{featuredArticles.length > 0 ? (
					<motion.div 
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
					{translatedArticles.length > 0 ? (
						translatedArticles.map((article) => (
							<motion.div key={article._id} variants={itemVariants}>
								<Link to={`/article/${article.slug}`} className="cursor-pointer hover:opacity-90 transition-opacity block">
									{/* Image Container */}
									<div className="overflow-hidden rounded-2xl h-72 md:h-96 lg:h-[460px]">
										<img
											src={article.featuredImage.url}
											alt={article.featuredImage.alt || article.title}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Content */}
									<div className="pt-3 md:pt-4">
										{/* Author */}
										<p className={`text-xs md:text-sm text-gray-800 font-medium mb-2 ${getFontClass(i18n.language)}`}>
											{article.translatedAuthor}
										</p>

										{/* Title (blue, large, uppercase) */}
										<h3 className={`text-[22px] md:text-3xl lg:text-4xl font-extrabold text-[#0054FF] uppercase leading-[1.1] tracking-tight ${getFontClass(i18n.language)}`}>
											{article.translatedTitle}
										</h3>
									</div>
								</Link>
							</motion.div>
						))
					) : (
						// Fallback to original articles while translating
						featuredArticles.map((article) => (
							<motion.div key={article._id} variants={itemVariants}>
								<Link to={`/article/${article.slug}`} className="cursor-pointer hover:opacity-90 transition-opacity block">
									{/* Image Container */}
									<div className="overflow-hidden rounded-2xl h-72 md:h-96 lg:h-[460px]">
										<img
											src={article.featuredImage.url}
											alt={article.featuredImage.alt || article.title}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Content */}
									<div className="pt-3 md:pt-4">
										{/* Author */}
										<p className={`text-xs md:text-sm text-gray-800 font-medium mb-2 ${getFontClass(i18n.language)}`}>
											{article.author}
										</p>

										{/* Title (blue, large, uppercase) */}
										<h3 className={`text-[22px] md:text-3xl lg:text-4xl font-extrabold text-[#0054FF] uppercase leading-[1.1] tracking-tight ${getFontClass(i18n.language)}`}>
											{article.title}
										</h3>
									</div>
								</Link>
							</motion.div>
						))
					)}
				</motion.div>
				) : (
					<div className="text-center py-16">
						<h3 className={`text-xl font-semibold text-gray-600 mb-4 ${getFontClass(i18n.language)}`}>
							No Featured Articles Found
						</h3>
						<p className={`text-gray-500 ${getFontClass(i18n.language)}`}>
							No articles are currently marked as featured. Please check back later.
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default Featured;
