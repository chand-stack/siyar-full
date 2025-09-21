import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGetCategoriesQuery } from '../../../../Redux/api/categoryApi';
import { useGetSeriesQuery } from '../../../../Redux/api/seriesApi';
import { googleTranslationService, type SupportedLanguage } from '../../../../services/googleTranslationService';

const Categories: React.FC = () => {
  const { i18n } = useTranslation();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ isActive: true });
  const { data: seriesData, isLoading: seriesLoading } = useGetSeriesQuery({ isActive: true });
  const [isTranslating, setIsTranslating] = React.useState(false);

  const isLoading = categoriesLoading || seriesLoading || isTranslating;


  // State for translated titles
  const [translatedCategories, setTranslatedCategories] = React.useState<Array<{
    _id: string;
    title: string;
    translatedTitle: string;
    [key: string]: unknown;
  }>>([]);
  const [translatedSeries, setTranslatedSeries] = React.useState<Array<{
    _id: string;
    title: string;
    translatedTitle: string;
    [key: string]: unknown;
  }>>([]);

  // Effect to translate categories when data or language changes
  React.useEffect(() => {
    const translateCategories = async () => {
      if (categoriesData?.data) {
        console.log(`🔄 Starting category translation to: ${i18n.language}`);
        console.log(`📋 Categories to translate:`, categoriesData.data.map(c => c.title));
        
        setIsTranslating(true);
        
        try {
          // Extract all category titles
          const categoryTitles = categoriesData.data.map(category => category.title);
          
          // Use batch translation for better performance
          const currentLanguage = i18n.language as SupportedLanguage;
          
          console.log(`🌐 Translating ${categoryTitles.length} categories to ${currentLanguage}`);
          const translatedTitles = await googleTranslationService.translateBatch(categoryTitles, currentLanguage);
          
          console.log(`✅ Translation results:`, translatedTitles);
          
          // Map translated titles back to categories
          const translated = categoriesData.data.map((category, index) => ({
            ...category,
            translatedTitle: translatedTitles[index] || category.title
          }));
          
          setTranslatedCategories(translated);
          console.log(`🎯 Categories translation completed successfully`);
        } catch (error) {
          console.error('❌ Failed to translate categories:', error);
          // Fallback to original titles
          const fallback = categoriesData.data.map(category => ({
            ...category,
            translatedTitle: category.title
          }));
          setTranslatedCategories(fallback);
        } finally {
          setIsTranslating(false);
        }
      }
    };

    translateCategories();
  }, [categoriesData?.data, i18n.language]);

  // Effect to translate series when data or language changes
  React.useEffect(() => {
    const translateSeries = async () => {
      if (seriesData?.data) {
        console.log(`🔄 Starting series translation to: ${i18n.language}`);
        console.log(`📋 Series to translate:`, seriesData.data.map(s => s.title));
        
        setIsTranslating(true);
        
        try {
          // Extract all series titles
          const seriesTitles = seriesData.data.map(seriesItem => seriesItem.title);
          
          // Use batch translation for better performance
          const currentLanguage = i18n.language as SupportedLanguage;
          
          console.log(`🌐 Translating ${seriesTitles.length} series to ${currentLanguage}`);
          const translatedTitles = await googleTranslationService.translateBatch(seriesTitles, currentLanguage);
          
          console.log(`✅ Series translation results:`, translatedTitles);
          
          // Map translated titles back to series
          const translated = seriesData.data.map((seriesItem, index) => ({
            ...seriesItem,
            translatedTitle: translatedTitles[index] || seriesItem.title
          }));
          
          setTranslatedSeries(translated);
          console.log(`🎯 Series translation completed successfully`);
        } catch (error) {
          console.error('❌ Failed to translate series:', error);
          // Fallback to original titles
          const fallback = seriesData.data.map(seriesItem => ({
            ...seriesItem,
            translatedTitle: seriesItem.title
          }));
          setTranslatedSeries(fallback);
        } finally {
          setIsTranslating(false);
        }
      }
    };

    translateSeries();
  }, [seriesData?.data, i18n.language]);

  // Function to get font class based on language
  const getFontClass = (language: string) => {
    switch (language) {
      case 'ar': return 'font-cairo';
      case 'id': return 'font-cairo';
      case 'tr': return 'font-roboto';
      default: return 'font-cairo';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                className="w-32 h-12 bg-gray-200 animate-pulse rounded-lg"
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6">
        {/* Categories and Series Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-4 min-h-[60px] w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
                     {/* Categories */}
           {translatedCategories.map((category) => (
             <motion.div key={category._id} variants={itemVariants} className="flex-shrink-0 inline-block">
               <Link
                 to={`/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                 className={`px-6 py-3 bg-white border-2 border-[#03045E] text-[#03045E] font-semibold uppercase tracking-wide rounded-lg hover:bg-[#03045E] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:ring-opacity-50 whitespace-nowrap min-h-[48px] flex items-center justify-center ${getFontClass(i18n.language)}`}
               >
                 {category.translatedTitle}
               </Link>
             </motion.div>
           ))}
           
           {/* Series */}
           {translatedSeries.map((seriesItem) => (
             <motion.div key={seriesItem._id} variants={itemVariants} className="flex-shrink-0 inline-block">
               <Link
                 to={`/series/${seriesItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                 className={`px-6 py-3 bg-white border-2 border-[#03045E] text-[#03045E] font-semibold uppercase tracking-wide rounded-lg hover:bg-[#03045E] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:ring-opacity-50 whitespace-nowrap min-h-[48px] flex items-center justify-center ${getFontClass(i18n.language)}`}
               >
                 {seriesItem.translatedTitle}
               </Link>
             </motion.div>
           ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
