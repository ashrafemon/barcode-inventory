import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "..";
import { API_URL } from "../../constants/urls";
import { jsonHeaders } from "./options";

const categories = createApi({
    reducerPath: "categoriesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        headers: jsonHeaders,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = state.auth.token ?? Cookies.get("auth_token") ?? null;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    keepUnusedDataFor: 5,
    refetchOnReconnect: true,
    tagTypes: ["Categories", "Category"],
    endpoints: (builder) => ({
        fetchCategories: builder.query({
            query: (params) => `categories?${params}`,
            transformResponse: (response: { data: any }) => response?.data,
            providesTags: ["Categories"],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: "categories",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Categories"],
        }),
        fetchCategory: builder.query({
            query: (id) => `categories/${id}`,
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ["Category"],
        }),
        updateCategory: builder.mutation({
            query: (data) => ({
                url: `categories/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `categories/${id}`,
                method: "DELETE",
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const {
    useFetchCategoriesQuery,
    useCreateCategoryMutation,
    useFetchCategoryQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categories;

export default categories;
