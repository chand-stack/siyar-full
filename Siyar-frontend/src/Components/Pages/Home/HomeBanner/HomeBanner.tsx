import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import banner from '../../../../assets/home-bg.jpg'
import banner2 from '../../../../assets/home-bg2.jpg'
import { ImagePreloader } from '../../../../utils/imagePreloader';

const HomeBanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Array of background images
  const backgroundImages = [banner, banner2];
  
  // Preload images for faster loading with priority loading
  useEffect(() => {
    const preloadImages = async () => {
      console.log('🔄 Starting banner image preloading...');
      
      // Add critical image preload to document head
      ImagePreloader.preloadCriticalImage(backgroundImages[0]);
      
      // Set a timeout fallback to ensure loading state doesn't persist
      const timeoutId = setTimeout(() => {
        console.log('⏰ Banner loading timeout - showing images anyway');
        setImagesLoaded(true);
      }, 3000); // 3 second timeout
      
      // Simple and reliable preloading approach
      const imagePromises = backgroundImages.map((src, index) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            console.log(`✅ Image ${index + 1} loaded: ${src.split('/').pop()}`);
            resolve(src);
          };
          img.onerror = () => {
            console.warn(`❌ Image ${index + 1} failed to load: ${src.split('/').pop()}`);
            reject(new Error(`Failed to load ${src}`));
          };
          
          // Set loading attributes based on priority
          if (index === 0) {
            img.setAttribute('fetchpriority', 'high');
            img.loading = 'eager';
          } else {
            img.setAttribute('fetchpriority', 'low');
            img.loading = 'lazy';
          }
          
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        clearTimeout(timeoutId);
        setImagesLoaded(true);
        console.log('✅ All banner images loaded successfully');
      } catch (error) {
        console.warn('⚠️ Banner image preloading failed:', error);
        clearTimeout(timeoutId);
        // Still show the component even if some images fail
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  // Change background image every 5 seconds (increased from 3 for better UX)
  useEffect(() => {
    if (!imagesLoaded) return; // Don't start slideshow until images are loaded

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length, imagesLoaded]);

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
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Loading State - Show elegant gradient while images load */}
      {!imagesLoaded && (
        <div className="absolute inset-0">
          {/* Elegant gradient background as placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#03045E] via-[#0054FF] to-[#03045E]">
            {/* Subtle animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          </div>
          <div className="absolute inset-0 bg-[#03045E]/60"></div>
        </div>
      )}

      {/* Background Images with Crossfade - Always show images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt="Ancient city landscape" 
            loading="eager" // Load immediately for above-the-fold content
            decoding="async" // Async decoding for better performance
            fetchPriority={index === 0 ? "high" : "low"} // Prioritize first image
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              willChange: 'opacity', // Optimize for smooth transitions
              backfaceVisibility: 'hidden', // Improve rendering performance
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
            onLoad={() => {
              if (index === 0) {
                console.log('✅ Hero image displayed');
                // Ensure images are marked as loaded when first image loads
                setImagesLoaded(true);
              }
            }}
            onError={() => {
              console.warn(`❌ Image ${index + 1} failed to display: ${image.split('/').pop()}`);
              // Still mark as loaded to prevent infinite loading state
              if (index === 0) {
                setImagesLoaded(true);
              }
            }}
          />
        ))}
      </div>

      {/* Dark Overlay - Matching the navbar background color */}
      <div className="absolute inset-0 bg-[#03045E]/80"></div>

      {/* Content Container - Fixed to ensure content stays at bottom */}
      <motion.div 
        className="relative z-10 min-h-screen flex items-end"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-6 pb-20 md:pb-32">
          <div className="max-w-4xl">
            {/* NEW JOURNAL Label - Mobile: top, Desktop: right of line */}
            <motion.div className="mb-6" variants={itemVariants}>
              <span className={`text-white text-sm md:text-base font-medium tracking-wide block lg:hidden mb-4 ${getFontClass(i18n.language)}`}>
                {t('home.banner.newJournal')}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('home.banner.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2 
              className={`text-lg md:text-xl lg:text-2xl text-white italic font-normal mb-4 ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('home.banner.subtitle')}
            </motion.h2>

            {/* Author and Line with NEW JOURNAL on right for desktop */}
            <motion.div 
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              <span className={`text-white text-base md:text-lg font-medium ${getFontClass(i18n.language)}`}>
                {t('home.banner.author')}
              </span>
              <div className="flex-1 h-px bg-white/60"></div>
              <span className={`text-white text-sm md:text-base font-medium tracking-wide hidden lg:block ${getFontClass(i18n.language)}`}>
                {t('home.banner.newJournal')}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeBanner;