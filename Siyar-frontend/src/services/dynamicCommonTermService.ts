// Dynamic Common Term Service - NO STATIC COMMON TERMS
// This service ONLY uses backend data for translations

class DynamicCommonTermService {
  private translationCache: Map<string, string> = new Map();
  private backendDataTranslations: Map<string, Map<string, string>> = new Map();

  // Main translation function - completely dynamic based on backend data
  async translateContent(content: string, targetLanguage: string): Promise<string> {
    if (!content || targetLanguage === 'en') {
      return content;
    }

    const cacheKey = `${content}_${targetLanguage}`;
    
    // Check cache first
    if (this.translationCache.has(cacheKey)) {
      console.log(`Cache hit for "${content}" -> "${this.translationCache.get(cacheKey)}"`);
      return this.translationCache.get(cacheKey)!;
    }

    try {
      // Translate using backend data as the source
      const translatedContent = await this.translateUsingBackendData(content, targetLanguage);
      
      // Cache the result
      this.translationCache.set(cacheKey, translatedContent);
      
      return translatedContent;
    } catch (error) {
      console.warn('Dynamic translation failed:', error);
      return content; // Fallback to original
    }
  }

  // Translate using backend data as the source - TRULY DYNAMIC
  private async translateUsingBackendData(content: string, targetLanguage: string): Promise<string> {
    const words = content.split(/\s+/);
    
    const translatedWords = await Promise.all(
      words.map(async (word) => {
        // Clean the word
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (!cleanWord) {
          return word;
        }

        // Try to find translation from our backend data
        const translation = await this.findTranslationFromBackendData(cleanWord, targetLanguage);
        
        return translation || word; // Use original if no translation found
      })
    );

    return translatedWords.join(' ');
  }

  // Find translation from backend data
  private async findTranslationFromBackendData(word: string, targetLanguage: string): Promise<string | null> {
    try {
      // First, check if we have this word in our backend data translations
      const languageTranslations = this.backendDataTranslations.get(targetLanguage);
      if (languageTranslations && languageTranslations.has(word)) {
        return languageTranslations.get(word)!;
      }

      // If not found, try to find it in existing backend data translations
      const translation = this.searchInBackendDataTranslations(word, targetLanguage);
      if (translation) {
        // Store it for future use
        this.storeBackendDataTranslation(word, targetLanguage, translation);
        return translation;
      }

      return null;
    } catch (error) {
      console.warn(`Error finding translation for "${word}":`, error);
      return null;
    }
  }

  // Search for translations in backend data - TRULY DYNAMIC, NO STATIC COMMON TERMS
  private searchInBackendDataTranslations(word: string, targetLanguage: string): string | null {
    try {
      // ONLY search in our backend data translations - NO static common.* keys
      const languageTranslations = this.backendDataTranslations.get(targetLanguage);
      if (languageTranslations) {
        // Look for exact matches in our backend data
        if (languageTranslations.has(word)) {
          return languageTranslations.get(word)!;
        }
        
        // Look for partial matches in our backend data
        for (const [backendWord, translation] of languageTranslations.entries()) {
          if (backendWord.toLowerCase().includes(word.toLowerCase()) || 
              word.toLowerCase().includes(backendWord.toLowerCase())) {
            return translation;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn(`Error in dynamic search for "${word}":`, error);
      return null;
    }
  }

  // Store backend data translation
  private storeBackendDataTranslation(word: string, language: string, translation: string): void {
    if (!this.backendDataTranslations.has(language)) {
      this.backendDataTranslations.set(language, new Map());
    }
    
    const languageTranslations = this.backendDataTranslations.get(language)!;
    languageTranslations.set(word, translation);
  }

  // Process backend data and create dynamic translations - TRULY DYNAMIC
  async processBackendData(data: Array<{ title: string; author?: string }>, targetLanguage: string): Promise<void> {
    if (!data || data.length === 0) return;

    try {
      // Store the actual backend data content as translations
      data.forEach(item => {
        // Store title as a translation
        if (item.title) {
          this.storeBackendDataTranslation(item.title.toLowerCase(), targetLanguage, item.title);
          
          // Also store individual words from title
          const words = item.title.split(/\s+/);
          words.forEach(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (cleanWord && cleanWord.length > 2) {
              this.storeBackendDataTranslation(cleanWord, targetLanguage, word);
            }
          });
        }
        
        // Store author as a translation
        if (item.author) {
          this.storeBackendDataTranslation(item.author.toLowerCase(), targetLanguage, item.author);
          
          // Also store individual words from author
          const words = item.author.split(/\s+/);
          words.forEach(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (cleanWord && cleanWord.length > 2) {
              this.storeBackendDataTranslation(cleanWord, targetLanguage, word);
            }
          });
        }
      });
    } catch (error) {
      console.warn('Failed to process backend data:', error);
    }
  }

  // Batch translate multiple content items
  async translateBatch(contents: string[], targetLanguage: string): Promise<string[]> {
    return Promise.all(
      contents.map(content => this.translateContent(content, targetLanguage))
    );
  }

  // Clear translation cache
  clearCache(): void {
    this.translationCache.clear();
  }

  // Get cache statistics
  getCacheStats(): { totalKeys: number; backendDataCount: number } {
    const totalKeys = this.translationCache.size;
    const backendDataCount = Array.from(this.backendDataTranslations.values())
      .reduce((sum, translations) => sum + translations.size, 0);
    
    return { totalKeys, backendDataCount };
  }

  // Get all backend data translations for a language
  getBackendDataTranslations(language: string): Map<string, string> | undefined {
    return this.backendDataTranslations.get(language);
  }

  // Debug: Log all backend data translations - NO STATIC COMMON TERMS
  debugBackendDataTranslations(language: string): void {
    const translations = this.backendDataTranslations.get(language);
    if (translations) {
      console.log(`Backend data translations for ${language}:`, Object.fromEntries(translations));
    } else {
      console.log(`No backend data translations found for ${language}`);
    }
    
    console.log(`Total backend data translations for ${language}: ${translations?.size || 0}`);
  }
}

// Export singleton instance
export const dynamicCommonTermService = new DynamicCommonTermService();

// Export the class for testing purposes
export { DynamicCommonTermService };
