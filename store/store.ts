import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "@/services/authService";
import authSlice from "@/store/reducers/authSlice";
import {chatService} from "@/services/chatService";


const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [chatService.reducerPath]: chatService.reducer,
    authSlice
})

export const setupStore = ()=>{
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                authApi.middleware,
                chatService.middleware
            )
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']