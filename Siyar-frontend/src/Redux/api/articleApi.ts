import { baseApi } from './baseApi';

export interface IArticleContent {
  html: string;
  plainText?: string;
  wordCount: number;
}

export interface IArticleImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface IArticleGalleryItem extends IArticleImage {
  order: number;
}

export interface IArticleSeriesRef {
  id: string;
  order: number;
}

export interface IArticleMeta {
  description: string;
  keywords: string[];
  ogImage?: string;
}

export type TranslationStatus = "draft" | "published" | "archived";

export interface IArticleTranslationMeta {
  articleId: string;
  status: TranslationStatus;
  lastTranslatedAt: string;
  translationProvider?: string;
}

export interface IArticleStats {
  views: number;
  shares: number;
  readingTime: number;
}

export type ArticleStatus = "draft" | "published" | "archived";
export type SupportedLanguage = "en" | "ar" | "id" | "tr";

export interface IArticle {
  _id: string;
  slug: string;
  language: SupportedLanguage;
  title: string;
  subtitle?: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  content: IArticleContent;
  featuredImage: IArticleImage;
  gallery?: Array<IArticleGalleryItem>;
  categories: string[];
  series?: IArticleSeriesRef;
  meta: IArticleMeta;
  translations?: Record<SupportedLanguage, IArticleTranslationMeta>;
  status: ArticleStatus;
  isFeatured: boolean;
  isLatest: boolean;
  stats: IArticleStats;
  // New dual-language support fields
  dualLanguageAuthor?: {
    en?: string;
    ar?: string;
  };
  dualLanguageTitle?: {
    en?: string;
    ar?: string;
  };
  dualLanguageSubtitle?: {
    en?: string;
    ar?: string;
  };
  dualLanguage?: {
    en?: {
      title?: string;
      subtitle?: string;
      excerpt?: string;
      content?: IArticleContent;
      featuredImage?: IArticleImage;
      meta?: IArticleMeta;
      readTime?: string;
      status?: ArticleStatus;
    };
    ar?: {
      title?: string;
      subtitle?: string;
      excerpt?: string;
      content?: IArticleContent;
      featuredImage?: IArticleImage;
      meta?: IArticleMeta;
      readTime?: string;
      status?: ArticleStatus;
    };
  };
}

export interface CreateArticleRequest {
  slug: string;
  language: SupportedLanguage;
  title: string;
  subtitle?: string;
  excerpt?: string;
  author: string;
  readTime: string;
  content: IArticleContent;
  featuredImage: IArticleImage;
  gallery?: Array<IArticleGalleryItem>;
  categories: string[];
  series?: IArticleSeriesRef;
  meta: IArticleMeta;
  status: ArticleStatus;
  isFeatured: boolean;
  isLatest: boolean;
  // New dual-language support fields
  dualLanguageAuthor?: {
    en?: string;
    ar?: string;
  };
  dualLanguageTitle?: {
    en?: string;
    ar?: string;
  };
  dualLanguageSubtitle?: {
    en?: string;
    ar?: string;
  };
  dualLanguage?: {
    en?: {
      title?: string;
      subtitle?: string;
      excerpt?: string;
      content?: IArticleContent;
      featuredImage?: IArticleImage;
      meta?: IArticleMeta;
      readTime?: string;
      status?: ArticleStatus;
    };
    ar?: {
      title?: string;
      subtitle?: string;
      excerpt?: string;
      content?: IArticleContent;
      featuredImage?: IArticleImage;
      meta?: IArticleMeta;
      readTime?: string;
      status?: ArticleStatus;
    };
  };
}

export type UpdateArticleRequest = Partial<CreateArticleRequest>;

export interface ListArticlesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: IArticle[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SingleArticleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IArticle;
}

export interface CreateArticleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IArticle;
}

export interface TranslateArticleRequest {
  targetLanguage: SupportedLanguage;
}

export const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all articles with pagination and filters
    getArticles: builder.query<ListArticlesResponse, {
      page?: number;
      limit?: number;
      language?: SupportedLanguage;
      category?: string;
      series?: string;
      status?: ArticleStatus;
    }>({
      query: (params) => ({
        url: '/articles',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.language && { language: params.language }),
          ...(params.category && { category: params.category }),
          ...(params.series && { series: params.series }),
          ...(params.status && { status: params.status }),
        },
      }),
      providesTags: ['article'],
    }),

    // Get article by slug
    getArticleBySlug: builder.query<SingleArticleResponse, {
      slug: string;
      language?: SupportedLanguage;
    }>({
      query: ({ slug, language }) => ({
        url: `/articles/${slug}`,
        params: { language: language || 'en' },
      }),
      providesTags: (_, __, { slug }) => [{ type: 'article', id: slug }],
    }),

    // Create new article
    createArticle: builder.mutation<CreateArticleResponse, CreateArticleRequest>({
      query: (articleData) => ({
        url: '/articles',
        method: 'POST',
        body: articleData,
      }),
      invalidatesTags: ['article'],
    }),

    // Update article
    updateArticle: builder.mutation<SingleArticleResponse, {
      id: string;
      data: UpdateArticleRequest;
    }>({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'article', id },
        'article'
      ],
    }),

    // Delete article
    deleteArticle: builder.mutation<{ success: boolean; statusCode: number; message: string; data: null }, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['article'],
    }),

    // Translate article
    translateArticle: builder.mutation<SingleArticleResponse, {
      id: string;
      targetLanguage: SupportedLanguage;
    }>({
      query: ({ id, targetLanguage }) => ({
        url: `/articles/${id}/translate`,
        method: 'POST',
        body: { targetLanguage },
      }),
      invalidatesTags: ['article'],
    }),

    // Get featured articles
    getFeaturedArticles: builder.query<ListArticlesResponse, {
      language?: SupportedLanguage;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/articles',
        params: {
          isFeatured: 'true',
          status: 'published',
          limit: params.limit || 10,
          ...(params.language && { language: params.language }),
        },
      }),
      providesTags: ['article'],
    }),

    // Get latest articles
    getLatestArticles: builder.query<ListArticlesResponse, {
      language?: SupportedLanguage;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/articles',
        params: {
          isLatest: 'true',
          status: 'published',
          limit: params.limit || 10,
          ...(params.language && { language: params.language }),
        },
      }),
      providesTags: ['article'],
    }),

    // Create dual-language article
    createDualLanguageArticle: builder.mutation<CreateArticleResponse, CreateArticleRequest>({
      query: (articleData) => ({
        url: '/articles/dual-language',
        method: 'POST',
        body: articleData,
      }),
      invalidatesTags: ['article'],
    }),

    // Update dual-language article
    updateDualLanguageArticle: builder.mutation<SingleArticleResponse, {
      id: string;
      data: UpdateArticleRequest;
    }>({
      query: ({ id, data }) => ({
        url: `/articles/${id}/dual-language`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'article', id },
        'article'
      ],
    }),

    // Add Arabic version to existing article
    addArabicVersion: builder.mutation<SingleArticleResponse, {
      id: string;
      arabicContent: {
        title?: string;
        subtitle?: string;
        excerpt?: string;
        content?: IArticleContent;
        featuredImage?: IArticleImage;
        meta?: IArticleMeta;
        readTime?: string;
        status?: ArticleStatus;
      };
    }>({
      query: ({ id, arabicContent }) => ({
        url: `/articles/${id}/arabic-version`,
        method: 'POST',
        body: arabicContent,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'article', id },
        'article'
      ],
    }),

    // Add Arabic author, title, subtitle to existing article
    addArabicAuthorTitleSubtitle: builder.mutation<SingleArticleResponse, {
      id: string;
      arabicFields: {
        author?: string;
        title?: string;
        subtitle?: string;
      };
    }>({
      query: ({ id, arabicFields }) => ({
        url: `/articles/${id}/arabic-fields`,
        method: 'POST',
        body: arabicFields,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'article', id },
        'article'
      ],
    }),

    // Update dual-language fields (author, title, subtitle)
    updateDualLanguageFields: builder.mutation<SingleArticleResponse, {
      id: string;
      fields: {
        dualLanguageAuthor?: {
          en?: string;
          ar?: string;
        };
        dualLanguageTitle?: {
          en?: string;
          ar?: string;
        };
        dualLanguageSubtitle?: {
          en?: string;
          ar?: string;
        };
      };
    }>({
      query: ({ id, fields }) => ({
        url: `/articles/${id}/dual-language-fields`,
        method: 'PATCH',
        body: fields,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'article', id },
        'article'
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useTranslateArticleMutation,
  useGetFeaturedArticlesQuery,
  useGetLatestArticlesQuery,
  useCreateDualLanguageArticleMutation,
  useUpdateDualLanguageArticleMutation,
  useAddArabicVersionMutation,
  useAddArabicAuthorTitleSubtitleMutation,
  useUpdateDualLanguageFieldsMutation,
} = articleApi;
