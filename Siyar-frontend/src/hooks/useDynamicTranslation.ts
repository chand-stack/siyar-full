import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { dynamicCommonTermService } from '../services/dynamicCommonTermService';

interface UseDynamicTranslationOptions {
  enableCache?: boolean;
  enableAutoTranslation?: boolean;
  fallbackToOriginal?: boolean;
}

export const useDynamicTranslation = (options: UseDynamicTranslationOptions = {}) => {
  const {
    enableCache = true,
    enableAutoTranslation = true,
    fallbackToOriginal = true
  } = options;

  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

  // Get current language
  const currentLanguage = useMemo(() => i18n.language, [i18n.language]);

  // Translate single content
  const translateContent = useCallback(async (
    content: string,
    targetLanguage?: string
  ): Promise<string> => {
    if (!content || !enableAutoTranslation) {
      return content;
    }

    const language = targetLanguage || currentLanguage;
    
    // Return original for English
    if (language === 'en') {
      return content;
    }

    // Check cache first
    const cacheKey = `${content}_${language}`;
    if (enableCache && translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      setIsTranslating(true);
      const translatedContent = await dynamicCommonTermService.translateContent(content, language);
      
      // Cache the result
      if (enableCache) {
        setTranslationCache(prev => new Map(prev).set(cacheKey, translatedContent));
      }
      
      return translatedContent;
    } catch (error) {
      console.warn('Dynamic translation failed:', error);
      return fallbackToOriginal ? content : '';
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, enableCache, enableAutoTranslation, fallbackToOriginal, translationCache]);

  // Translate multiple content items
  const translateBatch = useCallback(async (
    contents: string[],
    targetLanguage?: string
  ): Promise<string[]> => {
    if (!contents.length || !enableAutoTranslation) {
      return contents;
    }

    const language = targetLanguage || currentLanguage;
    
    // Return original for English
    if (language === 'en') {
      return contents;
    }

    try {
      setIsTranslating(true);
      const translatedContents = await dynamicCommonTermService.translateBatch(contents, language);
      
      // Cache the results
      if (enableCache) {
        const newCache = new Map(translationCache);
        contents.forEach((content, index) => {
          const cacheKey = `${content}_${language}`;
          newCache.set(cacheKey, translatedContents[index]);
        });
        setTranslationCache(newCache);
      }
      
      return translatedContents;
    } catch (error) {
      console.warn('Batch dynamic translation failed:', error);
      return fallbackToOriginal ? contents : contents.map(() => '');
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, enableCache, enableAutoTranslation, fallbackToOriginal, translationCache]);

  // Auto-translate content when language changes
  const autoTranslate = useCallback(async (content: string): Promise<string> => {
    return translateContent(content);
  }, [translateContent]);

  // Auto-translate multiple content items when language changes
  const autoTranslateBatch = useCallback(async (contents: string[]): Promise<string[]> => {
    return translateBatch(contents);
  }, [translateBatch]);

  // Clear translation cache
  const clearCache = useCallback(() => {
    setTranslationCache(new Map());
    dynamicCommonTermService.clearCache();
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return {
      hookCache: translationCache.size,
      serviceCache: dynamicCommonTermService.getCacheStats()
    };
  }, [translationCache]);

  // Effect to clear cache when language changes
  useEffect(() => {
    if (enableCache) {
      clearCache();
    }
  }, [currentLanguage, enableCache, clearCache]);

  return {
    // Translation functions
    translateContent,
    translateBatch,
    autoTranslate,
    autoTranslateBatch,
    
    // Cache management
    clearCache,
    getCacheStats,
    
    // State
    isTranslating,
    currentLanguage,
    
    // Utilities
    isEnglish: currentLanguage === 'en',
    needsTranslation: currentLanguage !== 'en'
  };
};

// Export a simplified version for basic use cases
export const useSimpleDynamicTranslation = () => {
  const { translateContent, isTranslating, currentLanguage } = useDynamicTranslation({
    enableCache: true,
    enableAutoTranslation: true,
    fallbackToOriginal: true
  });

  return {
    translate: translateContent,
    isTranslating,
    language: currentLanguage
  };
};
