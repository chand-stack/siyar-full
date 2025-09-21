import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { googleTranslationService, type SupportedLanguage } from '../services/googleTranslationService';

interface UseGoogleTranslationOptions {
  enableCache?: boolean;
  autoTranslate?: boolean;
}

export const useGoogleTranslation = (options: UseGoogleTranslationOptions = {}) => {
  const { enableCache = true, autoTranslate = true } = options;
  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  const currentLanguage = i18n.language as SupportedLanguage;

  // Single text translation
  const translateText = useCallback(async (text: string, targetLang?: SupportedLanguage): Promise<string> => {
    const targetLanguage = targetLang || currentLanguage;
    
    if (!autoTranslate || targetLanguage === 'en') {
      return text;
    }

    try {
      setIsTranslating(true);
      const result = await googleTranslationService.translateText(text, targetLanguage);
      return result;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, autoTranslate]);

  // Batch text translation
  const translateBatch = useCallback(async (texts: string[], targetLang?: SupportedLanguage): Promise<string[]> => {
    const targetLanguage = targetLang || currentLanguage;
    
    if (!autoTranslate || targetLanguage === 'en') {
      return texts;
    }

    try {
      setIsTranslating(true);
      const results = await googleTranslationService.translateBatch(texts, targetLanguage);
      return results;
    } catch (error) {
      console.warn('Batch translation failed:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, autoTranslate]);

  // Title-specific translation (alias for translateText)
  const translateTitle = useCallback(async (title: string, targetLang?: SupportedLanguage): Promise<string> => {
    return translateText(title, targetLang);
  }, [translateText]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (enableCache) {
      googleTranslationService.clearCache();
    }
  }, [enableCache]);

  // Get cache stats
  const getCacheStats = useCallback(() => {
    return googleTranslationService.getCacheStats();
  }, []);

  // Clear cache when language changes (optional)
  useEffect(() => {
    if (enableCache) {
      // Optionally clear cache on language change
      // googleTranslationService.clearCache();
    }
  }, [currentLanguage, enableCache]);

  return {
    // Translation functions
    translateText,
    translateBatch,
    translateTitle,
    
    // Cache management
    clearCache,
    getCacheStats,
    
    // State
    isTranslating,
    currentLanguage,
    
    // Utilities
    isEnglish: currentLanguage === 'en',
    needsTranslation: currentLanguage !== 'en' && googleTranslationService.isAvailable(),
    isServiceAvailable: googleTranslationService.isAvailable(),
    supportedLanguages: googleTranslationService.getSupportedLanguages()
  };
};

// Simplified hook for basic use cases
export const useSimpleGoogleTranslation = () => {
  const { translateText, isTranslating, currentLanguage, needsTranslation } = useGoogleTranslation({
    enableCache: true,
    autoTranslate: true
  });

  return {
    translate: translateText,
    isTranslating,
    language: currentLanguage,
    needsTranslation
  };
};
