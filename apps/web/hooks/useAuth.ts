"use client";

import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { decodeToken, isExpired } from "react-jwt";
import { useDispatch } from "react-redux";
import { API_URL, SITE_URL } from "../constants/urls";
import { ResponseType } from "../dto/base";
import {
    logout,
    setAuthentication,
    setCurrentUser,
} from "../stores/reducers/auth";

export const AUTH_TOKEN_KEY = "auth_token";
// const AUTH_REFRESH_KEY = "auth_refresh";

const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const authenticate = (token: string) => {
        setAuthenticate(token, async () => {
            storeToken(token);
            await fetchMe(token);
            redirectToDashboard();
        });
    };

    const setAuthenticate = (token: string, cb: () => void = () => {}) => {
        const { decode, isExpire } = decodeUserToken(token);
        if (!decode || isExpire) {
            router.replace(SITE_URL.auth.login);
            return;
        }
        dispatch(
            setAuthentication({
                token: token,
                isAuthenticate: true,
                decode,
            })
        );
        cb();
    };

    const decodeUserToken = (token: string) => {
        const decode: { id: string; type: string } | null = decodeToken(token);
        const isTokenExpire = isExpired(token);
        return { decode, isExpire: isTokenExpire };
    };

    const storeToken = (token: string) => {
        const in30Minutes = new Date(new Date().getTime() + 30 * 60 * 1000);
        Cookies.set(AUTH_TOKEN_KEY, token, { expires: in30Minutes });
    };

    const clearToken = () => {
        Cookies.remove(AUTH_TOKEN_KEY);
    };

    const redirectToDashboard = () => {
        router.replace(SITE_URL.dashboard);
    };

    const unauthenticated = (cb: () => void = () => {}) => {
        dispatch(logout());
        clearToken();
        cb();
    };

    const checkAuth = (cb: () => void = () => {}) => {
        const token = Cookies.get(AUTH_TOKEN_KEY) ?? "";

        const authPages = ["login", "register"];
        const isInAuthPage = authPages.some((item) => pathname.includes(item));

        if (!token) {
            unauthenticated();
            router.replace(SITE_URL.auth.login);
            cb();
            return;
        }

        const { isExpire } = decodeUserToken(token);
        if (isExpire) {
            unauthenticated();
            router.replace(SITE_URL.auth.login);

            cb();
            return;
        }

        setAuthenticate(token, async () => {
            if (isInAuthPage) {
                redirectToDashboard();
            }
            await fetchMe(token);
        });

        cb();
    };

    const fetchMe = async (token: string) => {
        const req = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const res = await req.json();

        if (res.status !== ResponseType.SUCCESS) {
            return null;
        }

        dispatch(setCurrentUser({ currentUser: res.data }));
        return res.data;
    };

    return { authenticate, unauthenticated, checkAuth, fetchMe };
};

export default useAuth;
