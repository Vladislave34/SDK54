import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";




import API_ENV from "@/env";
import IUserLogin from "@/model/auth/IUserLogin";



export const authApi  = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_ENV.API_BASE_URL}/api/Account/`,

    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        // Register: build.mutation<{token : string}, IUserRegister>({
        //     query: (model)=>{
        //         const formData = serialize(model)
        //         return {
        //             url: "Register",
        //             method: "POST",
        //             body: formData,
        //         }
        //
        //     },
        //     invalidatesTags: ["Auth"]
        // }),

        Login: build.mutation<{token : string}, IUserLogin>({
            query: (model) => ({
                url: "Login",
                method: "POST",
                body: model

            }),
            invalidatesTags: ["Auth"]
        })
    })
})