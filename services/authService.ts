import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";





import IUserLogin from "@/model/auth/IUserLogin";
import {API_ENV} from "@/env";

import IRegisterModel from "@/model/auth/IRegisterModel";
import {serialize} from "object-to-formdata";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IUserModel from "@/model/auth/IUserModel";
import IEditProfile from "@/model/auth/IEditProfile";
import {IForgotPasswordModel} from "@/model/auth/IForgotPasswordModel";
import IResetPasswordModel from "@/model/auth/IResetPasswordModel";



export const authApi  = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_ENV.API_BASE_URL}/Account/`,
        prepareHeaders: async (headers) => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },

    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        Register: build.mutation<{token : string}, IRegisterModel>({
            query: (model)=>{
                const formData = serialize(model)
                return {
                    url: "Register",
                    method: "POST",
                    body: formData,
                }

            },
            invalidatesTags: ["Auth"]
        }),
        Login: build.mutation<{token : string}, IUserLogin>({
            query: (model) => ({
                url: "Login",
                method: "POST",
                body: model

            }),
            invalidatesTags: ["Auth"]
        }),
        getUser: build.query<IUserModel, void>({
            query: () => {
                return {
                    url: "Me",
                    method: "GET",
                }
            },
            providesTags: ['Auth']
        }),
        editUser: build.mutation<{token : string}, IEditProfile>({
            query: (model)=>{
                const data = serialize(model);
                return{
                    url: 'EditProfile',
                    method: "PUT",
                    body: data
                }
            },
            invalidatesTags: ["Auth"]
        }),
        forgotPassword: build.mutation<void, IForgotPasswordModel>({
            query: (model) => ({
                url: 'ForgotPassword',
                method: 'POST',
                body: model
            })
        }),
        resetPassword: build.mutation<void, IResetPasswordModel>({
            query: (model)=>({
                url: "ResetPassword",
                body: model
            })
        })
    })
})