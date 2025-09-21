import React from 'react';
import { Link, useParams, useLocation } from 'react-router';
import { FaPlus } from 'react-icons/fa6';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import banner from '../../../assets/category-bg.jpg';
import { useGetArticlesQuery } from '../../../Redux/api/articleApi';
import { useGetCategoriesQuery } from '../../../Redux/api/categoryApi';
import { useGetSeriesQuery } from '../../../Redux/api/seriesApi';
import { googleTranslationService, type SupportedLanguage } from '../../../services/googleTranslationService';

type ListingParams = {
	type?: string;
	slug?: string;
};

const toTitle = (text: string | undefined): string => {
	if (!text) return '';
	return text
		.replace(/[-_]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (c) => c.toUpperCase());
};

const ListingPage = () => {
	const { t, i18n } = useTranslation();
	const params = useParams<ListingParams>();
	const location = useLocation();
	const [currentPage, setCurrentPage] = useState(1);
	const articlesPerPage = 9;

	// Translation state
	const [isTranslating, setIsTranslating] = useState(false);
	const [translatedCategoryName, setTranslatedCategoryName] = useState<string>('');
	
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
	
	const [translatedArticles, setTranslatedArticles] = useState<TranslatedArticle[]>([]);

	// Font classes based on language
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar':
				return 'font-cairo';
			case 'id':
				return 'font-cairo';
			case 'tr':
				return 'font-roboto';
			default:
				return 'font-cairo';
		}
	};

	// Determine whether this is a category or a series route based on the path
	const isSeries = location.pathname.startsWith('/series/');
	const displayName = toTitle(params.slug);

	// First, fetch the category/series data to get the actual ID
	const { data: categoriesData } = useGetCategoriesQuery({ isActive: true });
	const { data: seriesData } = useGetSeriesQuery({ isActive: true });

	// Find the actual category/series by matching the slug
	const targetCategory = categoriesData?.data?.find(
		cat => cat.title.toLowerCase().replace(/\s+/g, '-') === params.slug
	);
	const targetSeries = seriesData?.data?.find(
		ser => ser.title.toLowerCase().replace(/\s+/g, '-') === params.slug
	);

	// Fetch articles based on category or series using the actual ID
	const { data: articlesData, isLoading: articlesLoading } = useGetArticlesQuery({
		limit: currentPage * articlesPerPage, // Load more articles as page increases
		...(isSeries 
			? { series: targetSeries?._id } 
			: { category: targetCategory?._id }
		),
		status: 'published',
		language: 'en'
	}, {
		// Only run the query when we have the target ID
		skip: isSeries ? !targetSeries?._id : !targetCategory?._id
	});

	const articles = React.useMemo(() => 
		articlesData?.data?.items || [], 
		[articlesData?.data?.items]
	);
	const totalArticles = articlesData?.data?.total || 0;
	const hasMoreArticles = totalArticles > currentPage * articlesPerPage;
	const isLoading = articlesLoading || (!targetCategory && !targetSeries) || isTranslating;

	// Handle loading more articles
	const handleLoadMore = () => {
		setCurrentPage(prev => prev + 1);
	};

	// Effect to translate category/series name
	React.useEffect(() => {
		const translateCategoryName = async () => {
			const actualTitle = isSeries ? targetSeries?.title : targetCategory?.title;
			if (actualTitle) {
				console.log(`🔄 Starting category/series name translation to: ${i18n.language}`);
				console.log(`📋 Name to translate: ${actualTitle}`);
				
				try {
					const currentLanguage = i18n.language as SupportedLanguage;
					const translatedName = await googleTranslationService.translateText(actualTitle, currentLanguage);
					setTranslatedCategoryName(translatedName);
					console.log(`✅ Category/series name translation: "${actualTitle}" -> "${translatedName}"`);
				} catch (error) {
					console.warn('❌ Failed to translate category/series name:', error);
					setTranslatedCategoryName(actualTitle);
				}
			}
		};

		translateCategoryName();
	}, [targetCategory?.title, targetSeries?.title, isSeries, i18n.language]);

	// Effect to translate articles when data or language changes
	React.useEffect(() => {
		const translateArticles = async () => {
			if (articles.length > 0) {
				console.log(`🔄 Starting listing page articles translation to: ${i18n.language}`);
				console.log(`📋 Articles to translate:`, articles.map(a => ({ title: a.title, subtitle: a.subtitle, author: a.author })));
				
				setIsTranslating(true);
				
				try {
					// Extract all texts to translate (title, subtitle if exists, author)
					const allTexts = articles.reduce((acc, article) => {
						acc.push(article.title);
						if (article.subtitle) acc.push(article.subtitle);
						acc.push(article.author || 'Unknown Author');
						return acc;
					}, [] as string[]);
					
					// Use batch translation for better performance
					const currentLanguage = i18n.language as SupportedLanguage;
					
					console.log(`🌐 Translating ${allTexts.length} listing page texts to ${currentLanguage}`);
					const translatedTexts = await googleTranslationService.translateBatch(allTexts, currentLanguage);
					
					console.log(`✅ Listing page translation results:`, translatedTexts);
					
					// Map translated texts back to articles
					let textIndex = 0;
					const translated = articles.map((article) => {
						const translatedTitle = translatedTexts[textIndex++] || article.title;
						const translatedSubtitle = article.subtitle ? (translatedTexts[textIndex++] || article.subtitle) : undefined;
						const translatedAuthor = translatedTexts[textIndex++] || article.author || 'Unknown Author';
						
						return {
							...article,
							translatedTitle,
							translatedSubtitle,
							translatedAuthor
						};
					});
					
					setTranslatedArticles(translated);
					console.log(`🎯 Listing page articles translation completed successfully`);
				} catch (error) {
					console.error('❌ Failed to translate listing page articles:', error);
					// Fallback to original content
					const fallback = articles.map(article => ({
						...article,
						translatedTitle: article.title,
						translatedSubtitle: article.subtitle,
						translatedAuthor: article.author || 'Unknown Author'
					}));
					setTranslatedArticles(fallback);
				} finally {
					setIsTranslating(false);
				}
			}
		};

		translateArticles();
	}, [articles, i18n.language]);

	if (isLoading) {
		return (
			<div className="bg-white">
				{/* Loading Banner */}
				<section className="relative w-full">
					<img src={banner} alt="banner" className="w-full h-64 md:h-80 lg:h-[360px] object-cover" />
					<div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
						<div className="w-32 h-8 bg-white/20 animate-pulse rounded"></div>
						<div className="w-64 h-12 bg-white/20 animate-pulse rounded mt-4"></div>
					</div>
				</section>

				{/* Loading Cards */}
				<section className="py-12">
					<div className="container mx-auto px-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
							{Array.from({ length: 6 }).map((_, idx) => (
								<div key={idx} className="animate-pulse">
									<div className="w-full h-72 md:h-96 lg:h-[460px] bg-gray-200 rounded-2xl"></div>
									<div className="pt-4 md:pt-5">
										<div className="w-24 h-4 bg-gray-200 rounded mb-3"></div>
										<div className="w-full h-8 bg-gray-200 rounded"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className="bg-white">
			{/* Banner */}
			<section className="relative w-full">
				<img src={banner} alt="banner" className="w-full h-64 md:h-80 lg:h-[360px] object-cover" />
				<div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
					<p className={`uppercase tracking-widest text-xs md:text-sm opacity-90 ${getFontClass(i18n.language)}`}>
						{t(isSeries ? 'common.series' : 'common.category')}
					</p>
					<h1 className={`mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow ${getFontClass(i18n.language)}`}>
						{translatedCategoryName || displayName || (isSeries ? 'Series' : 'Category')}
					</h1>
				</div>
			</section>

			{/* Articles */}
			<section className="py-12">
				<div className="container mx-auto px-6">
					{articles.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
								{(translatedArticles.length > 0 ? translatedArticles : articles).map((article) => (
									<Link key={article._id} to={`/article/${article.slug}`} className="block group">
										<div className="overflow-hidden rounded-2xl h-72 md:h-96 lg:h-[460px]">
											<img 
												src={article.featuredImage.url} 
												alt={article.featuredImage.alt || article.title} 
												className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
											/>
										</div>
										<div className="pt-4 md:pt-5">
											<p className={`text-xs md:text-sm text-[#0054FF] font-semibold uppercase tracking-wide mb-3 ${getFontClass(i18n.language)}`}>
												{t(isSeries ? 'common.series' : 'common.category')}: {translatedCategoryName || displayName || (isSeries ? 'Series' : 'Category')}
											</p>
											<h3 className={`text-[22px] md:text-3xl lg:text-4xl font-extrabold text-black uppercase leading-[1.1] tracking-tight ${getFontClass(i18n.language)}`}>
												{'translatedTitle' in article ? article.translatedTitle : article.title}
											</h3>
											{article.subtitle && (
												<p className={`text-sm md:text-base text-gray-600 mt-2 italic ${getFontClass(i18n.language)}`}>
													{'translatedSubtitle' in article ? (article.translatedSubtitle || article.subtitle) : article.subtitle}
												</p>
											)}
											{/* Author info */}
											<div className="flex items-center mt-3 text-sm text-gray-500">
												<span className={`${getFontClass(i18n.language)}`}>
													{'translatedAuthor' in article ? article.translatedAuthor : (article.author || 'Unknown Author')}
												</span>
											</div>
										</div>
									</Link>
								))}
							</div>

							{/* More button - only show if there are more than 9 articles */}
							{hasMoreArticles && (
								<div className="pt-10 md:pt-12 flex justify-center">
									<button 
										onClick={handleLoadMore}
										className={`inline-flex items-center gap-2 bg-white text-[#03045E] border-2 border-[#0054FF] rounded-2xl h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-semibold hover:bg-[#0054FF] hover:text-white transition-colors duration-300 ${getFontClass(i18n.language)}`}
									>
										<FaPlus className="text-[#0054FF] group-hover:text-white" />
										{t('common.loadMore')} ({totalArticles - (currentPage * articlesPerPage)} remaining)
									</button>
								</div>
							)}

							
						</>
					) : (
						<div className="text-center py-16">
							<h3 className={`text-2xl font-semibold text-gray-600 mb-4 ${getFontClass(i18n.language)}`}>
								{t('common.noContent')} in this {t(isSeries ? 'common.series' : 'common.category').toLowerCase()}
							</h3>
							<p className={`text-gray-500 ${getFontClass(i18n.language)}`}>
								Check back later for new content in "{translatedCategoryName || displayName}"
							</p>
							{/* Debug info */}
							<div className="mt-4 text-sm text-gray-400">
								<p>Debug: Slug: {params.slug}</p>
								<p>Type: {isSeries ? 'Series' : 'Category'}</p>
								{isSeries ? (
									<p>Series ID: {targetSeries?._id || 'Not found'}</p>
								) : (
									<p>Category ID: {targetCategory?._id || 'Not found'}</p>
								)}
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default ListingPage;


