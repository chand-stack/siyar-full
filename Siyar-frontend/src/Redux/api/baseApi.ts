import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

export const baseApi = createApi({
    reducerPath:"baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "https://siyar-test-backend.vercel.app/api/v1",
        credentials: 'include', // Include cookies for authentication
        prepareHeaders: (headers, { getState }) => {
            try {
                // Get the token from the store
                const token = (getState() as RootState).auth?.accessToken;
                if (token) {
                    headers.set('authorization', `Bearer ${token}`);
                }
            } catch (error) {
                // If there's an error getting the token, continue without it
                console.warn('Could not get auth token:', error);
            }
            return headers;
        },
    }),
    tagTypes:["task", "article", "category", "series", "user", "video", "image"],
    endpoints:(builder)=>({
    getTask:builder.query({
        query:()=>"/tasks",
        providesTags:["task"]
    }),
    createTask:builder.mutation({
        query:(taskData)=>({
            url:"/tasks",
            method:"POST",
            body: taskData
        }),
        invalidatesTags:["task"]
    })
    })
})

export const { useGetTaskQuery, useCreateTaskMutation } = baseApi;