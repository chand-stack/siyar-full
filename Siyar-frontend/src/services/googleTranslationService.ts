// Language mapping for Google Translate API
const LANGUAGE_MAPPING = {
  'en': 'en',  // English
  'ar': 'ar',  // Arabic
  'id': 'id',  // Indonesian (Bahasa Indonesia)
  'tr': 'tr'   // Turkish
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_MAPPING;

// Backend API configuration - Using your deployed backend
const TRANSLATION_API_BASE = 'https://siyar-backend.vercel.app/api/v1/translate';

class GoogleTranslationService {
  private translationCache = new Map<string, string>();
  private isOnline = navigator.onLine;
  private isServerAvailable = true;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Check server availability on startup
    this.checkServerHealth();
  }

  /**
   * Check if translation server is available
   */
  private async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${TRANSLATION_API_BASE}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      this.isServerAvailable = response.ok;
      return this.isServerAvailable;
    } catch (error) {
      console.warn('Translation server is not available:', error);
      this.isServerAvailable = false;
      return false;
    }
  }

  /**
   * Translate a single text string using backend API
   */
  async translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    // Return original text if target language is English or text is empty
    if (!text || targetLanguage === 'en') {
      return text;
    }

    // Check if we're offline or server is unavailable
    if (!this.isOnline) {
      console.warn('Translation unavailable: Device is offline');
      return text;
    }

    if (!this.isServerAvailable) {
      console.warn('Translation unavailable: Server is not available');
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    if (this.translationCache.has(cacheKey)) {
      console.log(`Cache hit for translation: "${text}" -> "${this.translationCache.get(cacheKey)}"`);
      return this.translationCache.get(cacheKey)!;
    }

    try {
      console.log(`Translating "${text}" to ${targetLanguage} via backend API`);
      
      const response = await fetch(TRANSLATION_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          to: LANGUAGE_MAPPING[targetLanguage],
          from: 'auto'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Translation failed');
      }

      const translatedText = result.data.text || text;
      const detectedLanguage = result.data.from || 'unknown';
      
      // Cache the result
      this.translationCache.set(cacheKey, translatedText);
      
      console.log(`Translation result: "${text}" (detected: ${detectedLanguage}) -> "${translatedText}"`);
      return translatedText;
      
    } catch (error) {
      console.warn(`Translation failed for "${text}":`, error);
      
      // Check if server is down
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
        this.isServerAvailable = false;
        console.warn('Translation server appears to be down');
      }
      
      // Return original text as fallback
      return text;
    }
  }

  /**
   * Translate multiple texts in batch using backend API
   */
  async translateBatch(texts: string[], targetLanguage: SupportedLanguage): Promise<string[]> {
    // Return original texts if target language is English
    if (targetLanguage === 'en') {
      return texts;
    }

    // Check if we're offline or server is unavailable
    if (!this.isOnline) {
      console.warn('Translation unavailable: Device is offline');
      return texts;
    }

    if (!this.isServerAvailable) {
      console.warn('Translation unavailable: Server is not available');
      return texts;
    }

    try {
      console.log(`Batch translating ${texts.length} texts to ${targetLanguage} via backend API`);
      
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
        if (this.translationCache.has(cacheKey)) {
          results[index] = this.translationCache.get(cacheKey)!;
          console.log(`Cache hit for batch item: "${text}" -> "${results[index]}"`);
        } else {
          textsToTranslate.push(text);
          indexMap.push(index);
        }
      });

      // Translate uncached texts using backend API
      if (textsToTranslate.length > 0) {
        try {
          const response = await fetch(`${TRANSLATION_API_BASE}/batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              texts: textsToTranslate,
              to: LANGUAGE_MAPPING[targetLanguage],
              from: 'auto'
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (!result.success) {
            throw new Error(result.error || 'Batch translation failed');
          }

          const translatedTexts = result.data.translations || [];

          // Process results
          textsToTranslate.forEach((originalText, i) => {
            const translatedText = translatedTexts[i] || originalText;
            const originalIndex = indexMap[i];
            results[originalIndex] = translatedText;
            
            // Cache the result
            const cacheKey = `${originalText}_${targetLanguage}`;
            this.translationCache.set(cacheKey, translatedText);
            
            console.log(`Batch translation result: "${originalText}" -> "${translatedText}"`);
          });
        } catch (batchError) {
          console.warn('Batch translation failed, trying individual translations:', batchError);
          
          // Check if server is down
          if (batchError instanceof Error && (batchError.message.includes('fetch') || batchError.message.includes('NetworkError'))) {
            this.isServerAvailable = false;
            console.warn('Translation server appears to be down');
          }
          
          // Fallback to individual translations
          for (let i = 0; i < textsToTranslate.length; i++) {
            const originalText = textsToTranslate[i];
            const originalIndex = indexMap[i];
            
            try {
              const individualResult = await this.translateText(originalText, targetLanguage);
              results[originalIndex] = individualResult;
            } catch (individualError) {
              console.warn(`Individual translation failed for "${originalText}":`, individualError);
              results[originalIndex] = originalText; // Use original as fallback
            }
          }
        }
      }

      console.log(`Batch translation completed for ${texts.length} texts`);
      return results;
      
    } catch (error) {
      console.warn('Batch translation failed:', error);
      
      // Return original texts as fallback
      return texts;
    }
  }

  /**
   * Translate category/series title with smart caching
   */
  async translateTitle(title: string, targetLanguage: SupportedLanguage): Promise<string> {
    return this.translateText(title, targetLanguage);
  }

  /**
   * Split long text into chunks for translation (max 5000 chars per chunk)
   */
  private splitTextForTranslation(text: string, maxLength: number = 5000): string[] {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks: string[] = [];
    let currentChunk = '';
    const sentences = text.split(/[.!?]+/);

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          // If a single sentence is too long, split by words
          const words = sentence.split(' ');
          let wordChunk = '';
          for (const word of words) {
            if ((wordChunk + ' ' + word).length > maxLength) {
              if (wordChunk) {
                chunks.push(wordChunk.trim());
                wordChunk = word;
              } else {
                // If a single word is too long, just add it as is
                chunks.push(word);
              }
            } else {
              wordChunk += (wordChunk ? ' ' : '') + word;
            }
          }
          if (wordChunk) {
            currentChunk = wordChunk;
          }
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Translate long text by splitting it into chunks
   */
  async translateLongText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    if (!text || targetLanguage === 'en') {
      return text;
    }

    const chunks = this.splitTextForTranslation(text);
    if (chunks.length === 1) {
      return this.translateText(text, targetLanguage);
    }

    console.log(`Translating long text in ${chunks.length} chunks`);
    const translatedChunks = await this.translateBatch(chunks, targetLanguage);
    return translatedChunks.join('. ');
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.translationCache.clear();
    console.log('Translation cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.translationCache.size,
      keys: Array.from(this.translationCache.keys())
    };
  }

  /**
   * Check if service is available (online and server is running)
   */
  isAvailable(): boolean {
    return this.isOnline && this.isServerAvailable;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return Object.keys(LANGUAGE_MAPPING) as SupportedLanguage[];
  }

  /**
   * Detect if translation is needed
   */
  needsTranslation(targetLanguage: SupportedLanguage): boolean {
    return targetLanguage !== 'en' && this.isOnline;
  }
}

// Export singleton instance
export const googleTranslationService = new GoogleTranslationService();

// Export types
export type { SupportedLanguage };
export { GoogleTranslationService };
