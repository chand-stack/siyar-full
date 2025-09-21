import { baseApi } from './baseApi';

// Translation API endpoints using RTK Query
export const translationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Health check endpoint
    getTranslationHealth: builder.query<
      { success: boolean; status: string; message: string },
      void
    >({
      query: () => ({
        url: '/translate/health',
        method: 'GET',
      }),
    }),

    // Single translation endpoint
    translateText: builder.mutation<
      {
        success: boolean;
        data: {
          text: string;
          from: string;
          to: string;
          original: string;
        };
      },
      { text: string; to: string; from?: string }
    >({
      query: ({ text, to, from = 'auto' }) => ({
        url: '/translate',
        method: 'POST',
        body: { text, to, from },
      }),
    }),

    // Batch translation endpoint
    translateBatch: builder.mutation<
      {
        success: boolean;
        data: {
          translations: string[];
          from: string;
          to: string;
          originals: string[];
          count: number;
        };
      },
      { texts: string[]; to: string; from?: string }
    >({
      query: ({ texts, to, from = 'auto' }) => ({
        url: '/translate/batch',
        method: 'POST',
        body: { texts, to, from },
      }),
    }),

    // Get supported languages
    getSupportedLanguages: builder.query<
      {
        success: boolean;
        data: {
          languages: Record<string, string>;
          count: number;
        };
      },
      void
    >({
      query: () => ({
        url: '/translate/languages',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetTranslationHealthQuery,
  useTranslateTextMutation,
  useTranslateBatchMutation,
  useGetSupportedLanguagesQuery,
} = translationApi;
