import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Post = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Posts"],
    }),
    createPost: builder.mutation<Post, Omit<Post, "id">>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation<Post, Post>({
      query: (body) => ({
        url: `/posts/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    replacePost: builder.mutation<Post, Post>({
      query: (body) => ({
        url: `/posts/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useReplacePostMutation,
  useDeletePostMutation,
} = postsApi;
