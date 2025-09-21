import { baseApi } from './baseApi';

export interface ICategory {
  _id: string;
  title: string;
  slug?: string;
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  title: string;
  slug?: string;
  language?: string;
  isActive?: boolean;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export interface ListCategoriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory[];
}

export interface SingleCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory;
}

export interface CreateCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query<ListCategoriesResponse, {
      isActive?: boolean;
    }>({
      query: (params) => ({
        url: '/categories',
        params: {
          ...(params.isActive !== undefined && { isActive: params.isActive }),
        },
      }),
      providesTags: ['category'],
    }),

    // Create new category
    createCategory: builder.mutation<CreateCategoryResponse, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['category'],
    }),

    // Update category
    updateCategory: builder.mutation<SingleCategoryResponse, {
      id: string;
      data: UpdateCategoryRequest;
    }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['category'],
    }),

    // Delete category
    deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
