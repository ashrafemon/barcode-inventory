import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "..";
import { API_URL } from "../../constants/urls";
import { jsonHeaders } from "./options";

const reports = createApi({
    reducerPath: "reportsApi",
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
    tagTypes: ["Analytics"],
    endpoints: (builder) => ({
        fetchAnalyticReport: builder.query({
            query: () => `reports/analytics`,
            transformResponse: (response: { data: any }) => response?.data,
            providesTags: ["Analytics"],
        }),
    }),
});

export const { useFetchAnalyticReportQuery } = reports;

export default reports;
