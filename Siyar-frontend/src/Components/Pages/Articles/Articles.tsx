import React, { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGetArticlesQuery } from '../../../Redux/api/articleApi';
import banner from '../../../assets/category-bg.jpg';
import { googleTranslationService, type SupportedLanguage } from '../../../services/googleTranslationService';
const Articles: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Type for translated articles
  type TranslatedArticle = {
    _id: string;
    title: string;
    author: string;
    translatedTitle: string;
    translatedAuthor: string;
    slug: string;
    featuredImage?: {
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

  const { data: articlesData, isLoading: articlesLoading, error } = useGetArticlesQuery({
    limit: articlesPerPage * currentPage,
    status: 'published',
    language: 'en'
  });

  const articles = React.useMemo(() => 
    articlesData?.data?.items || [], 
    [articlesData?.data?.items]
  );
  const totalArticles = articlesData?.data?.total || 0;
  const hasMore = articles.length < totalArticles;
  const isLoading = articlesLoading || isTranslating;

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Effect to translate articles when data or language changes
  React.useEffect(() => {
    const translateArticles = async () => {
      if (articles.length > 0) {
        console.log(`🔄 Starting articles page translation to: ${i18n.language}`);
        console.log(`📋 Articles to translate:`, articles.map(a => ({ title: a.title, author: a.author })));
        
        setIsTranslating(true);
        
        try {
          // Extract all titles and authors
          const allTexts = articles.reduce((acc, article) => {
            acc.push(article.title, article.author || 'Unknown Author');
            return acc;
          }, [] as string[]);
          
          // Use batch translation for better performance
          const currentLanguage = i18n.language as SupportedLanguage;
          
          console.log(`🌐 Translating ${allTexts.length} article texts to ${currentLanguage}`);
          const translatedTexts = await googleTranslationService.translateBatch(allTexts, currentLanguage);
          
          console.log(`✅ Articles page translation results:`, translatedTexts);
          
          // Map translated texts back to articles (title, author pairs)
          const translated = articles.map((article, index) => {
            const titleIndex = index * 2;
            const authorIndex = index * 2 + 1;
            
            return {
              ...article,
              translatedTitle: translatedTexts[titleIndex] || article.title,
              translatedAuthor: translatedTexts[authorIndex] || article.author || 'Unknown Author'
            };
          });
          
          setTranslatedArticles(translated);
          console.log(`🎯 Articles page translation completed successfully`);
        } catch (error) {
          console.error('❌ Failed to translate articles page:', error);
          // Fallback to original titles and authors
          const fallback = articles.map(article => ({
            ...article,
            translatedTitle: article.title,
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
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="w-32 h-4 bg-gray-200 rounded mb-4 mx-auto animate-pulse"></div>
            <div className="w-full max-w-2xl h-8 bg-gray-200 rounded mb-4 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Articles</h1>
          <p className="text-gray-600">There was an error loading the articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
        {/* Banner */}
			<section className="relative w-full">
				<img src={banner} alt="banner" className="w-full h-64 md:h-80 lg:h-[360px] object-cover" />
				<div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
					{/* <p className="uppercase tracking-widest text-xs md:text-sm opacity-90">{t('nav.articles')}</p> */}
					<h1 className={`mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow ${getFontClass(i18n.language)}`}>
						{t('nav.articles')}
					</h1>
				</div>
			</section>
      <div className="container mx-auto px-6 py-16">
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight mb-6">
            {t('nav.articles')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our latest articles, insights, and stories from around the world.
          </p>
        </div> */}

        {articles.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {(translatedArticles.length > 0 ? translatedArticles : articles).map((article, index) => (
                <motion.div 
                  key={article._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/article/${article.slug}`} className="cursor-pointer hover:opacity-90 transition-opacity block">
                    {/* Image Container */}
                    <div className="overflow-hidden rounded-2xl h-72 md:h-96 lg:h-[460px]">
                      <img
                        src={article.featuredImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
                        alt={article.featuredImage?.alt || article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="pt-3 md:pt-4">
                      {/* Author */}
                      <p className={`text-xs md:text-sm font-medium mb-2 ${getFontClass(i18n.language)}`} style={{ color: '#1965FF' }}>
                        {'translatedAuthor' in article ? article.translatedAuthor : (article.author || 'Unknown Author')}
                      </p>

                      {/* Title (black, large, uppercase) */}
                      <h3 className={`text-[22px] md:text-3xl lg:text-4xl font-extrabold text-black uppercase leading-[1.1] tracking-tight ${getFontClass(i18n.language)}`}>
                        {'translatedTitle' in article ? article.translatedTitle : article.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 ${getFontClass(i18n.language)}`}
                >
                  {t('common.loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className={`text-2xl font-semibold text-gray-800 mb-4 ${getFontClass(i18n.language)}`}>
                {t('common.noContent')}
              </h2>
              <p className={`text-gray-600 ${getFontClass(i18n.language)}`}>
                There are no articles available at the moment. Check back later for new content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
