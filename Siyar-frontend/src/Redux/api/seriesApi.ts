import { baseApi } from './baseApi';

export interface ISeries {
  _id: string;
  title: string;
  slug?: string;
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeriesRequest {
  title: string;
  slug?: string;
  language?: string;
  isActive?: boolean;
}

export type UpdateSeriesRequest = Partial<CreateSeriesRequest>;

export interface ListSeriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ISeries[];
}

export interface SingleSeriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ISeries;
}

export interface CreateSeriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ISeries;
}

export const seriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all series
    getSeries: builder.query<ListSeriesResponse, {
      isActive?: boolean;
    }>({
      query: (params) => ({
        url: '/series',
        params: {
          ...(params.isActive !== undefined && { isActive: params.isActive }),
        },
      }),
      providesTags: ['series'],
    }),

    // Create new series
    createSeries: builder.mutation<CreateSeriesResponse, CreateSeriesRequest>({
      query: (seriesData) => ({
        url: '/series',
        method: 'POST',
        body: seriesData,
      }),
      invalidatesTags: ['series'],
    }),

    // Update series
    updateSeries: builder.mutation<SingleSeriesResponse, {
      id: string;
      data: UpdateSeriesRequest;
    }>({
      query: ({ id, data }) => ({
        url: `/series/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['series'],
    }),

    // Delete series
    deleteSeries: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/series/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['series'],
    }),
  }),
});

export const {
  useGetSeriesQuery,
  useCreateSeriesMutation,
  useUpdateSeriesMutation,
  useDeleteSeriesMutation,
} = seriesApi;
