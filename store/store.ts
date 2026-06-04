import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "@/services/authService";
import authSlice from "@/store/reducers/authSlice";


const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    authSlice
})

export const setupStore = ()=>{
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                authApi.middleware,
            )
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']