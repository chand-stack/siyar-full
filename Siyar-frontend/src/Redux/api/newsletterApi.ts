import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Newsletter subscription interface
export interface NewsletterSubscription {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: "active" | "unsubscribed" | "pending";
  klaviyoProfileId?: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  metadata?: {
    source?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Newsletter subscription request interface
export interface NewsletterSubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

// Newsletter subscription response interface
export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: NewsletterSubscription;
    klaviyoResponse: {
      success: boolean;
      data?: unknown;
    };
  };
}

// Newsletter unsubscribe request interface
export interface NewsletterUnsubscribeRequest {
  email: string;
}

// Newsletter stats interface
export interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  pending: number;
}

// Newsletter list response interface
export interface NewsletterListResponse {
  subscriptions: NewsletterSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://siyar-backend.vercel.app/api/v1/newsletter",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      try {
        const token = (getState() as RootState).auth?.accessToken;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.warn('Could not get auth token:', error);
      }
      return headers;
    },
  }),
  tagTypes: ["newsletter"],
  endpoints: (builder) => ({
    // Subscribe to newsletter
    subscribeToNewsletter: builder.mutation<NewsletterSubscriptionResponse, NewsletterSubscriptionRequest>({
      query: (subscriptionData) => ({
        url: "/subscribe",
        method: "POST",
        body: subscriptionData,
      }),
      invalidatesTags: ["newsletter"],
    }),

    // Unsubscribe from newsletter
    unsubscribeFromNewsletter: builder.mutation<{ success: boolean; message: string; data: NewsletterSubscription }, NewsletterUnsubscribeRequest>({
      query: (unsubscribeData) => ({
        url: "/unsubscribe",
        method: "POST",
        body: unsubscribeData,
      }),
      invalidatesTags: ["newsletter"],
    }),

    // Get subscription by email
    getSubscriptionByEmail: builder.query<{ success: boolean; message: string; data: NewsletterSubscription | null }, string>({
      query: (email) => `/subscription/${email}`,
      providesTags: (_, __, email) => [{ type: "newsletter", id: email }],
    }),

    // Get all subscriptions (admin)
    getAllSubscriptions: builder.query<{ success: boolean; message: string; data: NewsletterListResponse }, { page?: number; limit?: number; status?: string }>({
      query: ({ page = 1, limit = 20, status } = {}) => ({
        url: "/",
        params: { page, limit, status },
      }),
      providesTags: ["newsletter"],
    }),

    // Get newsletter stats (admin)
    getNewsletterStats: builder.query<{ success: boolean; message: string; data: NewsletterStats }, void>({
      query: () => "/stats",
      providesTags: ["newsletter"],
    }),
  }),
});

export const {
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation,
  useGetSubscriptionByEmailQuery,
  useGetAllSubscriptionsQuery,
  useGetNewsletterStatsQuery,
} = newsletterApi;
