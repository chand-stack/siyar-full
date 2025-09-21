import React from 'react';
import { FaFacebook, FaRegCirclePlay, FaPinterest } from 'react-icons/fa6';
import { GrShareOption } from 'react-icons/gr';
import { Link, useParams } from 'react-router';
import { useGetArticleBySlugQuery, useGetArticlesQuery, type IArticle } from '../../../Redux/api/articleApi';
import { useTranslation } from 'react-i18next';
import { googleTranslationService, type SupportedLanguage } from '../../../services/googleTranslationService';

type ArticleParams = {
	slug?: string;
};

const Article: React.FC = () => {
	const params = useParams<ArticleParams>();
	const slug = params.slug || '';
	const { t, i18n } = useTranslation();
	
	// Get current language for font styling
	const currentLanguage = i18n.language;

	// Translation state
	const [isTranslating, setIsTranslating] = React.useState(false);
	const [translatedArticle, setTranslatedArticle] = React.useState<{
		title?: string;
		subtitle?: string;
		author?: string;
		contentHtml?: string; // Store translated HTML with formatting preserved
		excerpt?: string;
	}>({});

	// Helper function to get the appropriate content based on current language and dual-language support
	const getDisplayContent = React.useCallback((article: IArticle | undefined) => {
		if (!article) return null;

		// For English: Always use original content.html from main article data
		if (currentLanguage === 'en') {
			return {
				title: article.title,
				subtitle: article.subtitle,
				author: article.author,
				content: article.content,
				excerpt: article.excerpt,
				featuredImage: article.featuredImage,
				readTime: article.readTime,
				status: article.status,
				useTranslation: false // Never use translation for English
			};
		}

		// For Arabic: Check if there's a dedicated Arabic version available
		if (currentLanguage === 'ar') {
			// Check if Arabic content is actually available (not just empty fields)
			const hasArabicContent = (article.dualLanguage?.ar?.title && article.dualLanguage.ar.title.trim()) || 
									(article.dualLanguage?.ar?.content?.html && article.dualLanguage.ar.content.html.trim()) || 
									(article.dualLanguageTitle?.ar && article.dualLanguageTitle.ar.trim()) ||
									(article.dualLanguage?.ar?.excerpt && article.dualLanguage.ar.excerpt.trim()) ||
									(article.dualLanguageAuthor?.ar && article.dualLanguageAuthor.ar.trim());
			
			console.log('🔍 Arabic content check:', {
				hasDualLanguageAr: !!article.dualLanguage?.ar,
				dualLanguageArObject: article.dualLanguage?.ar,
				hasArabicTitle: !!(article.dualLanguage?.ar?.title && article.dualLanguage.ar.title.trim()),
				hasArabicContentHtml: !!(article.dualLanguage?.ar?.content?.html && article.dualLanguage.ar.content.html.trim()),
				hasArabicTitleField: !!(article.dualLanguageTitle?.ar && article.dualLanguageTitle.ar.trim()),
				hasArabicExcerpt: !!(article.dualLanguage?.ar?.excerpt && article.dualLanguage.ar.excerpt.trim()),
				hasArabicAuthor: !!(article.dualLanguageAuthor?.ar && article.dualLanguageAuthor.ar.trim()),
				hasArabicContent: hasArabicContent
			});
			
			if (hasArabicContent && article.dualLanguage?.ar) {
				console.log('✅ Using dedicated Arabic content from database');
				return {
					title: article.dualLanguage.ar.title || article.dualLanguageTitle?.ar || article.title,
					subtitle: article.dualLanguage.ar.subtitle || article.dualLanguageSubtitle?.ar || article.subtitle,
					author: article.dualLanguageAuthor?.ar || article.author,
					content: article.dualLanguage.ar.content || article.content,
					excerpt: article.dualLanguage.ar.excerpt || article.excerpt,
					featuredImage: article.dualLanguage.ar.featuredImage || article.featuredImage,
					readTime: article.dualLanguage.ar.readTime || article.readTime,
					status: article.dualLanguage.ar.status || article.status,
					useTranslation: false // Don't use translation system for Arabic when dedicated content exists
				};
			} else {
				console.log('⚠️ No dedicated Arabic content found, will use translation system');
			}
		}

		// For Arabic (no dedicated content) and other languages: Use original content and translation system
		return {
			title: article.title,
			subtitle: article.subtitle,
			author: article.author,
			content: article.content,
			excerpt: article.excerpt,
			featuredImage: article.featuredImage,
			readTime: article.readTime,
			status: article.status,
			useTranslation: true // Use translation system for Arabic (fallback) and other languages
		};
	}, [currentLanguage]);
	const [translatedRelatedArticles, setTranslatedRelatedArticles] = React.useState<Array<{
		_id: string;
		title: string;
		subtitle?: string;
		author: string;
		translatedTitle: string;
		translatedSubtitle?: string;
		translatedAuthor: string;
		slug: string;
		featuredImage?: {
			url: string;
			alt?: string;
		};
		[key: string]: unknown;
	}>>([]);
	

	// Font classes based on UI language for interface elements
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar':
				return 'font-cairo'; // Arabic font
			case 'id':
				return 'font-cairo'; // Bahasa Indonesia - using Arabic font for better readability
			case 'tr':
				return 'font-roboto'; // Turkish - using Roboto
			default:
				return 'font-cairo'; // English and others - using Cairo
		}
	};


	// Helper function to translate HTML content while preserving formatting
	const translateHTMLContent = async (html: string, targetLanguage: SupportedLanguage): Promise<string> => {
		if (!html || targetLanguage === 'en') {
			return html;
		}

		try {
			// Create a temporary DOM element to parse HTML
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = html;
			
			// Find all text nodes and translate them
			const textNodes: { node: Text; originalText: string }[] = [];
			const walker = document.createTreeWalker(
				tempDiv,
				NodeFilter.SHOW_TEXT
			);

			let node = walker.nextNode();
			while (node) {
				const textNode = node as Text;
				const text = textNode.textContent?.trim();
				if (text && text.length > 3) { // Only translate meaningful text
					textNodes.push({ node: textNode, originalText: text });
				}
				node = walker.nextNode();
			}

			if (textNodes.length === 0) {
				return html; // No text to translate
			}

			// Extract all text content for batch translation
			const textsToTranslate = textNodes.map(item => item.originalText);
			
			console.log(`🔄 Translating HTML content: ${textsToTranslate.length} text nodes`);
			const translatedTexts = await googleTranslationService.translateBatch(textsToTranslate, targetLanguage);
			
			// Replace text nodes with translated content
			textNodes.forEach((item, index) => {
				const translatedText = translatedTexts[index] || item.originalText;
				item.node.textContent = translatedText;
			});

			return tempDiv.innerHTML;
		} catch (error) {
			console.warn('Failed to translate HTML content:', error);
			return html; // Return original HTML as fallback
		}
	};


	// Fetch the current article - try English first since it's more likely to have content
	const { data: articleData, isLoading: articleLoading, error: articleError } = useGetArticleBySlugQuery({
		slug,
		language: 'en'
	});

	// Handle both possible API response structures
	const article = (articleData?.data || articleData) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

	// Helper function to check if a string is a valid MongoDB ObjectId
	const isValidObjectId = (id: string) => {
		return /^[0-9a-fA-F]{24}$/.test(id);
	};

	// Fetch related articles from the same series and categories
	const { data: relatedArticlesData } = useGetArticlesQuery({
		limit: 10, // Fetch more to ensure we have enough related articles
		...(article?.series?.id && isValidObjectId(article.series.id) && { series: article.series.id }),
		...(article?.categories?.length && article.categories.length > 0 && isValidObjectId(article.categories[0]) && { category: article.categories[0] }),
		status: 'published',
		language: 'en'
	}, {
		skip: !article || articleLoading
	});

	// Get first 3 related articles, excluding the current article
	const relatedArticles = React.useMemo(() => 
		relatedArticlesData?.data?.items
			?.filter(related => related?._id !== article?._id)
			?.slice(0, 3) || [],
		[relatedArticlesData?.data?.items, article?._id]
	);

	// Effect to translate main article content
	React.useEffect(() => {
		const translateMainArticle = async () => {
			// Get display content to check if we should use translation
			const displayContent = getDisplayContent(article);
			
			// Only use translation system if:
			// 1. Article exists
			// 2. Current language is not English
			// 3. Display content indicates we should use translation (no dedicated language version available)
			if (article && currentLanguage !== 'en' && displayContent?.useTranslation) {
				console.log(`🔄 Starting main article translation to: ${currentLanguage}`);
				console.log(`📋 Article to translate:`, { title: article.title, subtitle: article.subtitle, author: article.author });
				
				setIsTranslating(true);
				
				try {
					const targetLanguage = currentLanguage as SupportedLanguage;
					
					// Translate basic fields first
					const basicTexts: string[] = [];
					if (article.title) basicTexts.push(article.title);
					if (article.subtitle) basicTexts.push(article.subtitle);
					if (article.author) basicTexts.push(article.author);
					if (article.excerpt) basicTexts.push(article.excerpt);
					
					console.log(`🌐 Translating ${basicTexts.length} basic article fields to ${targetLanguage}`);
					const translatedBasicTexts = basicTexts.length > 0 
						? await googleTranslationService.translateBatch(basicTexts, targetLanguage)
						: [];
					
					// Translate HTML content separately to preserve formatting
					let translatedContentHtml = '';
					if (article.content?.html) {
						console.log(`🌐 Translating HTML content to ${targetLanguage}`);
						translatedContentHtml = await translateHTMLContent(article.content.html, targetLanguage);
					}
					
					console.log(`✅ Main article translation completed`);
					
					// Map results back
					let index = 0;
					const translated = {
						title: article.title ? (translatedBasicTexts[index++] || article.title) : undefined,
						subtitle: article.subtitle ? (translatedBasicTexts[index++] || article.subtitle) : undefined,
						author: article.author ? (translatedBasicTexts[index++] || article.author) : undefined,
						excerpt: article.excerpt ? (translatedBasicTexts[index++] || article.excerpt) : undefined,
						contentHtml: translatedContentHtml || undefined
					};
					
					setTranslatedArticle(translated);
					console.log(`🎯 Main article translation completed successfully`);
				} catch (error) {
					console.error('❌ Failed to translate main article:', error);
					// Fallback to original content
					setTranslatedArticle({
						title: article.title,
						subtitle: article.subtitle,
						author: article.author,
						excerpt: article.excerpt,
						contentHtml: undefined // Don't translate HTML content if there's an error
					});
				} finally {
					setIsTranslating(false);
				}
			} else {
				// Reset translation state if:
				// 1. Current language is English, OR
				// 2. We have dedicated language content available (useTranslation: false)
				setTranslatedArticle({});
				setIsTranslating(false);
			}
		};

		translateMainArticle();
	}, [article, currentLanguage, getDisplayContent]);

	// Effect to translate related articles
	React.useEffect(() => {
		const translateRelatedArticles = async () => {
			if (relatedArticles.length > 0 && currentLanguage !== 'en') {
				console.log(`🔄 Starting related articles translation to: ${currentLanguage}`);
				console.log(`📋 Related articles to translate:`, relatedArticles.map(a => ({ title: a.title, subtitle: a.subtitle, author: a.author })));
				
				try {
					// Extract all texts to translate (title, subtitle if exists, author)
					const allTexts = relatedArticles.reduce((acc, relatedArticle) => {
						acc.push(relatedArticle.title);
						if (relatedArticle.subtitle) acc.push(relatedArticle.subtitle);
						acc.push(relatedArticle.author || 'Unknown Author');
						return acc;
					}, [] as string[]);
					
					const targetLanguage = currentLanguage as SupportedLanguage;
					
					console.log(`🌐 Translating ${allTexts.length} related article texts to ${targetLanguage}`);
					const translatedTexts = await googleTranslationService.translateBatch(allTexts, targetLanguage);
					
					console.log(`✅ Related articles translation results:`, translatedTexts);
					
					// Map translated texts back to related articles
					let textIndex = 0;
					const translated = relatedArticles.map((relatedArticle) => {
						const translatedTitle = translatedTexts[textIndex++] || relatedArticle.title;
						const translatedSubtitle = relatedArticle.subtitle ? (translatedTexts[textIndex++] || relatedArticle.subtitle) : undefined;
						const translatedAuthor = translatedTexts[textIndex++] || relatedArticle.author || 'Unknown Author';
						
						return {
							...relatedArticle,
							translatedTitle,
							translatedSubtitle,
							translatedAuthor
						};
					});
					
					setTranslatedRelatedArticles(translated);
					console.log(`🎯 Related articles translation completed successfully`);
				} catch (error) {
					console.error('❌ Failed to translate related articles:', error);
					// Fallback to original content
					const fallback = relatedArticles.map(relatedArticle => ({
						...relatedArticle,
						translatedTitle: relatedArticle.title,
						translatedSubtitle: relatedArticle.subtitle,
						translatedAuthor: relatedArticle.author || 'Unknown Author'
					}));
					setTranslatedRelatedArticles(fallback);
				}
			} else if (currentLanguage === 'en') {
				// Reset for English
				setTranslatedRelatedArticles([]);
			}
		};

		translateRelatedArticles();
	}, [relatedArticles, currentLanguage]);

	// Debug logging (remove in production)
	console.log('=== ARTICLE DEBUG INFO ===');
	console.log('Slug from URL:', slug);
	console.log('Loading State:', articleLoading);
	console.log('Error State:', articleError);
	console.log('Full API Response:', articleData);
	console.log('Article Data Type:', typeof articleData);
	console.log('Article Data Keys:', articleData ? Object.keys(articleData) : 'No data');
	console.log('Extracted Article:', article);
	console.log('Article Type:', typeof article);
	console.log('Article ID:', article?._id);
	console.log('Article Title:', article?.title);
	console.log('Article Content:', article?.content?.html ? 'Has HTML content' : 'No HTML content');
	console.log('Series ID:', article?.series?.id);
	console.log('Categories:', article?.categories);
	console.log('Related Articles Count:', relatedArticles.length);
	console.log('========================');

	if (articleLoading || isTranslating) {
		return (
			<div className="bg-white">
				<div className="container mx-auto px-6 py-8">
					<div className="text-center mb-8 animate-pulse">
						<div className="w-32 h-4 bg-gray-200 rounded mb-4 mx-auto"></div>
						<div className="w-full max-w-4xl h-16 bg-gray-200 rounded mb-4 mx-auto"></div>
						<div className="w-96 h-6 bg-gray-200 rounded mb-4 mx-auto"></div>
						<div className="w-48 h-4 bg-gray-200 rounded mx-auto"></div>
					</div>
					<div className="w-full h-[400px] bg-gray-200 rounded-lg animate-pulse"></div>
				</div>
			</div>
		);
	}

	if (articleError) {
		console.error('Article API Error:', articleError);
		return (
			<div className="bg-white">
				<div className="container mx-auto px-6 py-8 text-center">
					<h1 className="text-2xl font-bold text-red-600">Error Loading Article</h1>
					<p className="text-gray-500 mt-2">
						{articleError && 'status' in articleError && articleError.status === 404 
							? 'Article not found.' 
							: 'There was an error loading the article. Please try again later.'}
					</p>
					<div className="mt-4 text-sm text-gray-400">
						<p>Slug: {slug}</p>
						<p>Error: {JSON.stringify(articleError)}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="bg-white">
				<div className="container mx-auto px-6 py-8 text-center">
					<h1 className="text-2xl font-bold text-gray-600">Article not found</h1>
					<p className="text-gray-500 mt-2">The article you're looking for doesn't exist.</p>
					<div className="mt-4 text-sm text-gray-400">
						<p>Slug: {slug}</p>
						<p>Loading: {articleLoading ? 'Yes' : 'No'}</p>
						<p>Data: {articleData ? 'Received' : 'None'}</p>
					</div>
				</div>
			</div>
		);
	}

	// Get the appropriate content to display based on current language and dual-language support
	const displayContent = getDisplayContent(article);

	// Debug logging for dual-language vs translation logic
	console.log('=== DUAL-LANGUAGE DEBUG INFO ===');
	console.log('Current Language:', currentLanguage);
	console.log('Article has dualLanguage.ar:', !!article?.dualLanguage?.ar);
	console.log('Article dualLanguage.ar object:', article?.dualLanguage?.ar);
	console.log('Article dualLanguageTitle.ar:', article?.dualLanguageTitle?.ar);
	console.log('Article dualLanguageAuthor.ar:', article?.dualLanguageAuthor?.ar);
	console.log('Arabic content available:', !!(article?.dualLanguage?.ar?.title || article?.dualLanguage?.ar?.content?.html || article?.dualLanguageTitle?.ar));
	console.log('Display content useTranslation:', displayContent?.useTranslation);
	console.log('Content source:', displayContent?.useTranslation ? 'Translation System' : 'Dedicated Content');
	console.log('Translated article state:', Object.keys(translatedArticle).length > 0 ? 'Has translations' : 'No translations');
	console.log('================================');

	return (
		<div className={`bg-white ${getFontClass(currentLanguage)}`}>
			{/* Header Section */}
			<div className="container mx-auto px-6 py-8">
				<div className="text-center mb-8">
					{/* Date */}
					<p className={`text-sm text-gray-600 mb-4 uppercase tracking-wide ${getFontClass(currentLanguage)}`}>
						{t('article.publishedOn')} {new Date(article?.publishedAt || Date.now()).toLocaleDateString('en-US', {
							day: '2-digit',
							month: 'long',
							year: 'numeric'
						}).toUpperCase()}
					</p>
					
					{/* Main Title */}
					<h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-tight mb-4 ${getFontClass(currentLanguage)}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
						{displayContent?.useTranslation ? (translatedArticle.title || displayContent?.title) : displayContent?.title || 'Untitled Article'}
					</h1>
					
					{/* Subtitle */}
					{((displayContent?.useTranslation && translatedArticle.subtitle) || displayContent?.subtitle) && (
						<p className={`text-lg md:text-xl text-blue-600 italic mb-4 ${getFontClass(currentLanguage)}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
							{displayContent?.useTranslation ? (translatedArticle.subtitle || displayContent?.subtitle) : displayContent?.subtitle}
						</p>
					)}
					
					{/* Author */}
					<p className={`text-sm text-blue-600 font-semibold uppercase tracking-wide ${getFontClass(currentLanguage)}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
						{t('article.author')}: {displayContent?.useTranslation ? (translatedArticle.author || displayContent?.author) : displayContent?.author || 'Unknown Author'}
					</p>
				</div>

				{/* Hero Image */}
				<div className="mb-8">
					<img 
						src={displayContent?.featuredImage?.url || article?.featuredImage?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}
						alt={displayContent?.featuredImage?.alt || article?.featuredImage?.alt || displayContent?.title || article?.title || 'Article Image'} 
						className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-lg"
					/>
				</div>
			</div>

			<div className="container mx-auto px-6 max-w-4xl">
				{/* Social Sharing and Article Info */}
				<div className="border-t border-b py-4 mb-8" style={{ borderColor: '#03045E' }}>
					<div className="flex flex-wrap items-center justify-between">
						<div className="flex items-center space-x-6 mb-4 md:mb-0">
							<span className={`font-semibold text-sm ${getFontClass(currentLanguage)}`} style={{ color: '#03045E' }}>
								{t('article.readTime')}: {displayContent?.readTime || article?.readTime || '5:23'}
							</span>
							<div className="flex items-center space-x-2 cursor-pointer hover:opacity-80" style={{ color: '#03045E' }}>
								<span className={`text-sm font-semibold ${getFontClass(currentLanguage)}`}>{t('article.listen')}</span>
								<FaRegCirclePlay className="text-lg" />
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<span className={`font-semibold text-sm ${getFontClass(currentLanguage)}`} style={{ color: '#03045E' }}>{t('article.share')}</span>
							<div className="flex items-center space-x-3">
								<GrShareOption className="text-lg cursor-pointer hover:opacity-80" style={{ color: '#03045E' }} />
								<FaFacebook className="text-lg cursor-pointer hover:opacity-80" style={{ color: '#03045E' }} />
								<FaPinterest className="text-lg cursor-pointer hover:opacity-80" style={{ color: '#03045E' }} />
							</div>
						</div>
					</div>
				</div>

				{/* Article Content */}
				<div className={`prose prose-lg max-w-none ${getFontClass(currentLanguage)}`}>
					{displayContent?.content?.html || article?.content?.html ? (
						<div 
							className={`article-content text-lg leading-relaxed text-gray-800 ${getFontClass(currentLanguage)}`}
							dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
							style={{
								'--tw-prose-body': 'theme(colors.gray.800)',
								'--tw-prose-headings': 'theme(colors.black)',
								'--tw-prose-links': 'theme(colors.blue.600)',
								'--tw-prose-bold': 'theme(colors.black)',
								'--tw-prose-counters': 'theme(colors.gray.600)',
								'--tw-prose-bullets': 'theme(colors.gray.400)',
								'--tw-prose-hr': 'theme(colors.gray.200)',
								'--tw-prose-quotes': 'theme(colors.gray.900)',
								'--tw-prose-quote-borders': 'theme(colors.gray.200)',
								'--tw-prose-captions': 'theme(colors.gray.600)',
								'--tw-prose-code': 'theme(colors.gray.900)',
								'--tw-prose-pre-code': 'theme(colors.gray.200)',
								'--tw-prose-pre-bg': 'theme(colors.gray.800)',
								'--tw-prose-th-borders': 'theme(colors.gray.400)',
								'--tw-prose-td-borders': 'theme(colors.gray.200)',
							} as React.CSSProperties}
						>
							{displayContent?.useTranslation && translatedArticle.contentHtml ? (
								// Show translated HTML content with preserved formatting (for other languages)
								<div dangerouslySetInnerHTML={{ __html: translatedArticle.contentHtml }} />
							) : (
								// Show dual-language or original HTML content (for Arabic with dedicated content or English)
								<div dangerouslySetInnerHTML={{ __html: displayContent?.content?.html || article?.content?.html || '' }} />
							)}
						</div>
					) : (
						<div className={`text-lg leading-relaxed text-gray-800 ${getFontClass(currentLanguage)}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
							{((displayContent?.useTranslation && translatedArticle.excerpt) || displayContent?.excerpt || article?.excerpt) && (
								<p className="mb-6">
									{displayContent?.useTranslation ? (translatedArticle.excerpt || displayContent?.excerpt) : (displayContent?.excerpt || article?.excerpt)}
								</p>
							)}
							<p>{t('article.noContent')}</p>
						</div>
					)}
				</div>
			</div>

			{/* Read On Section */}
			{relatedArticles.length > 0 && (
				<div className="py-10 md:py-14">
					<div className="container mx-auto px-6 max-w-4xl">
						<hr className="border-t border-gray-200 mb-8" />
						<h3 className={`uppercase tracking-wider text-sm font-semibold text-gray-800 mb-6 ${getFontClass(currentLanguage)}`}>{t('article.relatedArticles')}</h3>
						
						{/* Desktop layout - Column instead of grid */}
						<div className="hidden lg:block">
							<div className="space-y-8">
								{(translatedRelatedArticles.length > 0 ? translatedRelatedArticles : relatedArticles).map((relatedArticle) => (
									<Link key={relatedArticle?._id} to={`/article/${relatedArticle?.slug || '#'}`} className="flex gap-6 items-start cursor-pointer hover:opacity-90 transition-opacity">
										<img 
											src={relatedArticle?.featuredImage?.url || 'https://via.placeholder.com/260x200?text=No+Image'} 
											alt={relatedArticle?.featuredImage?.alt || relatedArticle?.title || 'Related Article'} 
											className="w-[260px] h-[200px] object-cover rounded-2xl"
										/>
										<div>
											<h4 className={`text-[34px] leading-tight font-extrabold text-black mb-2 ${getFontClass(currentLanguage)}`}>
												{'translatedTitle' in relatedArticle ? relatedArticle.translatedTitle : (relatedArticle?.title || 'Untitled Article')}
											</h4>
											{(('translatedSubtitle' in relatedArticle ? relatedArticle.translatedSubtitle : relatedArticle?.subtitle)) && (
												<p className={`text-lg text-gray-800 ${getFontClass(currentLanguage)}`}>
													{'translatedSubtitle' in relatedArticle ? relatedArticle.translatedSubtitle : relatedArticle.subtitle}
												</p>
											)}
											{/* Author */}
											<p className={`text-sm text-gray-600 mt-2 ${getFontClass(currentLanguage)}`}>
												{t('article.author')}: {'translatedAuthor' in relatedArticle ? relatedArticle.translatedAuthor : (relatedArticle?.author || 'Unknown Author')}
											</p>
										</div>
									</Link>
								))}
							</div>
						</div>

						{/* Mobile / Tablet layout */}
						<div className="lg:hidden space-y-8">
							{(translatedRelatedArticles.length > 0 ? translatedRelatedArticles : relatedArticles).map((relatedArticle) => (
								<Link key={relatedArticle?._id} to={`/article/${relatedArticle?.slug || '#'}`} className="flex gap-5 items-start cursor-pointer hover:opacity-90 transition-opacity">
									<img 
										src={relatedArticle?.featuredImage?.url || 'https://via.placeholder.com/200x150?text=No+Image'} 
										alt={relatedArticle?.featuredImage?.alt || relatedArticle?.title || 'Related Article'} 
										className="w-[200px] h-[150px] object-cover rounded-2xl"
									/>
									<div>
										<h4 className={`text-[28px] leading-tight font-extrabold text-black mb-2 ${getFontClass(currentLanguage)}`}>
											{'translatedTitle' in relatedArticle ? relatedArticle.translatedTitle : (relatedArticle?.title || 'Untitled Article')}
										</h4>
										{(('translatedSubtitle' in relatedArticle ? relatedArticle.translatedSubtitle : relatedArticle?.subtitle)) && (
											<p className={`text-lg text-gray-800 ${getFontClass(currentLanguage)}`}>
												{'translatedSubtitle' in relatedArticle ? relatedArticle.translatedSubtitle : relatedArticle.subtitle}
											</p>
										)}
										{/* Author */}
										<p className={`text-sm text-gray-600 mt-2 ${getFontClass(currentLanguage)}`}>
											{t('article.author')}: {'translatedAuthor' in relatedArticle ? relatedArticle.translatedAuthor : (relatedArticle?.author || 'Unknown Author')}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Article;
