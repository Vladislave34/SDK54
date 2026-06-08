import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import ITokenDecode from "@/model/auth/ITokenDecode";

const getUserFromToken = (token: string): ITokenDecode | null => {
    try {
        return jwtDecode<ITokenDecode>(token) ?? null;
    } catch {
        return null;
    }
}

const initialState: { user: ITokenDecode | null } = {
    user: null  // AsyncStorage читається окремо
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            const user = getUserFromToken(action.payload);
            if (user) {
                state.user = user;

            }
        },
        logout: (state) => {
            state.user = null;
        },
        setUser: (state, action: PayloadAction<ITokenDecode | null>) => {
            state.user = action.payload;
        }
    }
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;