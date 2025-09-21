import type { SupportedLanguage } from '../Redux/api/articleApi';

// Translation service that integrates with your backend
export class TranslationService {
  private static instance: TranslationService;
  private baseUrl = 'http://localhost:5000/api/v1';

  private constructor() {}

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Translate an article to a target language
  async translateArticle(articleId: string, targetLanguage: SupportedLanguage) {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${articleId}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetLanguage }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Preview translation without saving
  async previewTranslation(articleId: string, targetLanguage: SupportedLanguage) {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${articleId}/translate/preview?targetLanguage=${targetLanguage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Preview failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Preview error:', error);
      throw error;
    }
  }

  // Get available translations for an article by checking articles with same slug
  async getArticleTranslations(slug: string) {
    try {
      const languages: SupportedLanguage[] = ['en', 'ar', 'id', 'tr'];
      const availableLanguages: SupportedLanguage[] = [];

      // Check each language to see if article exists
      for (const language of languages) {
        try {
          const response = await fetch(`${this.baseUrl}/articles/${slug}?language=${language}`);
          if (response.ok) {
            availableLanguages.push(language);
          }
        } catch (error) {
          // Language not available, continue
          console.log(`Article not available in ${language}`);
        }
      }

      return availableLanguages;
    } catch (error) {
      console.error('Fetch translations error:', error);
      return ['en']; // Default to English only
    }
  }

  // Check if an article has a translation in a specific language
  async hasTranslation(slug: string, language: SupportedLanguage): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${slug}?language=${language}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const translationService = TranslationService.getInstance();
