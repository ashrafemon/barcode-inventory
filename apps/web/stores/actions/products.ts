import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "..";
import { API_URL } from "../../constants/urls";
import { jsonHeaders } from "./options";

const products = createApi({
    reducerPath: "productsApi",
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
    tagTypes: ["Products", "Product"],
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: (params) => `products?${params}`,
            transformResponse: (response: { data: any }) => response?.data,
            providesTags: ["Products"],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Products"],
        }),
        fetchProduct: builder.query({
            query: (id) => `products/${id}`,
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ["Product"],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `products/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Products"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `products/${id}`,
                method: "DELETE",
            }),
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useFetchProductsQuery,
    useCreateProductMutation,
    useFetchProductQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = products;

export default products;
