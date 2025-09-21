import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Contact interfaces
export interface Contact {
  _id: string;
  email: string;
  name?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed" | "spam";
  adminNotes?: string;
  repliedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactRequest {
  email: string;
  name?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: {
    contacts: Contact[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  closed: number;
  spam: number;
}

export interface ContactStatsResponse {
  success: boolean;
  message: string;
  data: ContactStats;
}

export interface UpdateContactRequest {
  name?: string;
  subject?: string;
  message?: string;
  status?: "new" | "read" | "replied" | "closed" | "spam";
  adminNotes?: string;
}

export interface UpdateContactStatusRequest {
  status: "new" | "read" | "replied" | "closed" | "spam";
  adminNotes?: string;
}

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://siyar-backend.vercel.app/api/v1/contact",
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
  tagTypes: ["contact"],
  endpoints: (builder) => ({
    // Create contact (public endpoint)
    createContact: builder.mutation<ContactResponse, ContactRequest>({
      query: (contactData) => ({
        url: "/create-contact",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["contact"],
    }),

    // Get all contacts (admin)
    getAllContacts: builder.query<ContactListResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 20, status, search } = {}) => ({
        url: "/",
        params: { page, limit, status, search },
      }),
      providesTags: ["contact"],
    }),

    // Get contact by ID (admin)
    getContactById: builder.query<ContactResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "contact", id }],
    }),

    // Update contact (admin)
    updateContact: builder.mutation<ContactResponse, { id: string; data: UpdateContactRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "contact", id }, "contact"],
    }),

    // Update contact status (admin)
    updateContactStatus: builder.mutation<ContactResponse, { id: string; data: UpdateContactStatusRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "contact", id }, "contact"],
    }),

    // Delete contact (admin)
    deleteContact: builder.mutation<ContactResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),

    // Get contact stats (admin)
    getContactStats: builder.query<ContactStatsResponse, void>({
      query: () => "/stats",
      providesTags: ["contact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useGetContactStatsQuery,
} = contactApi;
