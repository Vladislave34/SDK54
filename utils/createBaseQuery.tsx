import { fetchBaseQuery } from "@reduxjs/toolkit/query";


import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_ENV} from "@/env";

export const createBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${API_ENV.API_BASE_URL}/${endpoint}/`,
        prepareHeaders: async (headers) => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });
