import { baseApi } from './baseApi';

export interface IVideo {
  _id: string;
  title: string;
  videoLink: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoRequest {
  title: string;
  videoLink: string;
  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;
}

export type UpdateVideoRequest = Partial<CreateVideoRequest>;

export interface ListVideosResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: IVideo[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SingleVideoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IVideo;
}

export interface CreateVideoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IVideo;
}

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all videos with pagination and filters
    getVideos: builder.query<ListVideosResponse, {
      page?: number;
      limit?: number;
      status?: "draft" | "published" | "archived";
      featured?: string;
    }>({
      query: (params) => ({
        url: '/videos',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.status && { status: params.status }),
          ...(params.featured && { featured: params.featured }),
        },
      }),
      providesTags: ['video'],
    }),

    // Get video by ID
    getVideoById: builder.query<SingleVideoResponse, string>({
      query: (id) => ({
        url: `/videos/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: 'video', id }],
    }),

    // Create new video
    createVideo: builder.mutation<CreateVideoResponse, CreateVideoRequest>({
      query: (videoData) => ({
        url: '/videos',
        method: 'POST',
        body: videoData,
      }),
      invalidatesTags: ['video'],
    }),

    // Update video
    updateVideo: builder.mutation<SingleVideoResponse, {
      id: string;
      data: UpdateVideoRequest;
    }>({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'video', id },
        'video'
      ],
    }),

    // Delete video
    deleteVideo: builder.mutation<{ success: boolean; statusCode: number; message: string; data: null }, string>({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['video'],
    }),

    // Set video as featured
    setVideoAsFeatured: builder.mutation<SingleVideoResponse, string>({
      query: (id) => ({
        url: `/videos/${id}/feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['video'],
    }),

    // Get featured videos
    getFeaturedVideos: builder.query<ListVideosResponse, {
      limit?: number;
    }>({
      query: (params) => ({
        url: '/videos/featured',
        params: {
          limit: params.limit || 10,
        },
      }),
      providesTags: ['video'],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useSetVideoAsFeaturedMutation,
  useGetFeaturedVideosQuery,
} = videoApi;
