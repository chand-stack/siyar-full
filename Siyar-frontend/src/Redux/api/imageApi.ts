import { baseApi } from './baseApi';

// Image interface
export interface IImage {
  _id: string;
  imageUrl: string;
  publicId?: string;
  originalFilename?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IImageUploadResponse {
  success: boolean;
  message: string;
  data: IImage;
}

export interface IImageListResponse {
  success: boolean;
  data: IImage[];
  count: number;
}

export interface IImageCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface IImageDeleteResponse {
  success: boolean;
  message: string;
}

export const imageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upload image to Cloudinary and get live link
    uploadImage: builder.mutation<{
      success: boolean;
      msg: string;
      data: {
        file_url: string;
        public_id: string;
        original_filename: string;
        file_size: number;
        file_type: string;
      };
    }, FormData>({
      query: (formData) => ({
        url: '/image-upload',
        method: 'POST',
        body: formData,
      }),
    }),

    // Store image URL in MongoDB after Cloudinary upload
    storeImageInDB: builder.mutation<IImageUploadResponse, {
      imageUrl: string;
      publicId?: string;
      originalFilename?: string;
      fileSize?: number;
      fileType?: string;
    }>({
      query: (imageData) => ({
        url: '/images',
        method: 'POST',
        body: imageData,
      }),
      invalidatesTags: ['image'],
    }),

    // Get all images
    getImages: builder.query<IImageListResponse, void>({
      query: () => '/images',
      providesTags: ['image'],
    }),

    // Get image by ID
    getImageById: builder.query<{ success: boolean; data: IImage }, string>({
      query: (id) => `/images/${id}`,
      providesTags: (_, __, id) => [{ type: 'image', id }],
    }),

    // Get image count
    getImageCount: builder.query<IImageCountResponse, void>({
      query: () => '/images/stats/count',
      providesTags: ['image'],
    }),

    // Update image URL
    updateImage: builder.mutation<{ success: boolean; message: string; data: IImage }, { id: string; imageUrl: string }>({
      query: ({ id, imageUrl }) => ({
        url: `/images/${id}`,
        method: 'PUT',
        body: { imageUrl },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'image', id }, 'image'],
    }),

    // Delete image (also deletes from Cloudinary)
    deleteImage: builder.mutation<IImageDeleteResponse, string>({
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'image', id }, 'image'],
    }),

    // Store image URL directly (if you already have a URL)
    createImageRecord: builder.mutation<IImageUploadResponse, {
      imageUrl: string;
      publicId?: string;
      originalFilename?: string;
      fileSize?: number;
      fileType?: string;
    }>({
      query: (imageData) => ({
        url: '/images',
        method: 'POST',
        body: imageData,
      }),
      invalidatesTags: ['image'],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useStoreImageInDBMutation,
  useGetImagesQuery,
  useGetImageByIdQuery,
  useGetImageCountQuery,
  useUpdateImageMutation,
  useDeleteImageMutation,
  useCreateImageRecordMutation,
} = imageApi;
