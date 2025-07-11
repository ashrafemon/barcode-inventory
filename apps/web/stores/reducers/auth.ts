import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        isAuthenticate: false,
        currentUser: null,
        tokenDecode: null,
    },
    reducers: {
        setAuthentication: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticate = action.payload.isAuthenticate;
            state.tokenDecode = action.payload.decode;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload.currentUser;
        },
        logout: (state) => {
            state.isAuthenticate = false;
            state.token = null;
            state.currentUser = null;
            state.tokenDecode = null;
        },
    },
});

export const { setCurrentUser, setAuthentication, logout } = authSlice.actions;
export default authSlice.reducer;
