import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslateTextMutation, useTranslateBatchMutation } from '../Redux/api/translationApi';

// Language mapping for Google Translate API
const LANGUAGE_MAPPING = {
  'en': 'en',  // English
  'ar': 'ar',  // Arabic
  'id': 'id',  // Indonesian (Bahasa Indonesia)
  'tr': 'tr'   // Turkish
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_MAPPING;

export const useReduxTranslation = () => {
  const { i18n } = useTranslation();
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());
  
  const [translateTextMutation] = useTranslateTextMutation();
  const [translateBatchMutation] = useTranslateBatchMutation();

  const currentLanguage = i18n.language as SupportedLanguage;

  // Single text translation
  const translateText = useCallback(async (text: string, targetLang?: SupportedLanguage): Promise<string> => {
    const targetLanguage = targetLang || currentLanguage;
    
    // Return original text if target language is English or text is empty
    if (!text || targetLanguage === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache.has(cacheKey)) {
      console.log(`Cache hit for translation: "${text}" -> "${translationCache.get(cacheKey)}"`);
      return translationCache.get(cacheKey)!;
    }

    try {
      console.log(`Translating "${text}" to ${targetLanguage} via Redux API`);
      
      const result = await translateTextMutation({
        text,
        to: LANGUAGE_MAPPING[targetLanguage],
        from: 'auto'
      }).unwrap();

      const translatedText = result.data.text || text;
      
      // Cache the result
      setTranslationCache(prev => new Map(prev).set(cacheKey, translatedText));
      
      console.log(`Translation result: "${text}" -> "${translatedText}"`);
      return translatedText;
      
    } catch (error) {
      console.warn(`Translation failed for "${text}":`, error);
      return text; // Fallback to original
    }
  }, [currentLanguage, translationCache, translateTextMutation]);

  // Batch text translation
  const translateBatch = useCallback(async (texts: string[], targetLang?: SupportedLanguage): Promise<string[]> => {
    const targetLanguage = targetLang || currentLanguage;
    
    // Return original texts if target language is English
    if (targetLanguage === 'en') {
      return texts;
    }

    try {
      console.log(`Batch translating ${texts.length} texts to ${targetLanguage} via Redux API`);
      
      // Check cache for each text
      const results: string[] = [];
      const textsToTranslate: string[] = [];
      const indexMap: number[] = [];

      texts.forEach((text, index) => {
        if (!text) {
          results[index] = text;
          return;
        }
        
        const cacheKey = `${text}_${targetLanguage}`;
        if (translationCache.has(cacheKey)) {
          results[index] = translationCache.get(cacheKey)!;
          console.log(`Cache hit for batch item: "${text}" -> "${results[index]}"`);
        } else {
          textsToTranslate.push(text);
          indexMap.push(index);
        }
      });

      // Translate uncached texts
      if (textsToTranslate.length > 0) {
        const result = await translateBatchMutation({
          texts: textsToTranslate,
          to: LANGUAGE_MAPPING[targetLanguage],
          from: 'auto'
        }).unwrap();

        const translatedTexts = result.data.translations || [];

        // Process results and update cache
        textsToTranslate.forEach((originalText, i) => {
          const translatedText = translatedTexts[i] || originalText;
          const originalIndex = indexMap[i];
          results[originalIndex] = translatedText;
          
          // Cache the result
          const cacheKey = `${originalText}_${targetLanguage}`;
          setTranslationCache(prev => new Map(prev).set(cacheKey, translatedText));
          
          console.log(`Batch translation result: "${originalText}" -> "${translatedText}"`);
        });
      }

      console.log(`Batch translation completed for ${texts.length} texts`);
      return results;
      
    } catch (error) {
      console.warn('Batch translation failed:', error);
      return texts; // Fallback to original texts
    }
  }, [currentLanguage, translationCache, translateBatchMutation]);

  // Clear translation cache
  const clearCache = useCallback(() => {
    setTranslationCache(new Map());
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return {
      size: translationCache.size,
      keys: Array.from(translationCache.keys())
    };
  }, [translationCache]);

  // Clear cache when language changes
  useEffect(() => {
    clearCache();
  }, [currentLanguage, clearCache]);

  return {
    // Translation functions
    translateText,
    translateBatch,
    
    // Cache management
    clearCache,
    getCacheStats,
    
    // State
    currentLanguage,
    
    // Utilities
    isEnglish: currentLanguage === 'en',
    needsTranslation: currentLanguage !== 'en'
  };
};

// Simplified hook for basic use cases
export const useSimpleReduxTranslation = () => {
  const { translateText, currentLanguage, needsTranslation } = useReduxTranslation();

  return {
    translate: translateText,
    language: currentLanguage,
    needsTranslation
  };
};
