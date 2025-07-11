import auth from "./auth";
import categories from "./categories";
import products from "./products";
import reports from "./reports";

export const apiReducers = {
    [auth.reducerPath]: auth.reducer,
    [categories.reducerPath]: categories.reducer,
    [products.reducerPath]: products.reducer,
    [reports.reducerPath]: reports.reducer,
};

export const apiMiddleWares = [
    auth.middleware,
    categories.middleware,
    products.middleware,
    reports.middleware,
];
