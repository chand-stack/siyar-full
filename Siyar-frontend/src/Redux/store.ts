import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { newsletterApi } from "./api/newsletterApi";
import { contactApi } from "./api/contactApi";
import languageReducer from "./slices/languageSlice";
import articlesReducer from "./slices/articleSlice";
import authReducer from "./slices/authSlice";


export const store = configureStore({
    reducer:{
        [baseApi.reducerPath]:baseApi.reducer,
        [newsletterApi.reducerPath]:newsletterApi.reducer,
        [contactApi.reducerPath]:contactApi.reducer,
        language: languageReducer,
        articles: articlesReducer,
        auth: authReducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware, newsletterApi.middleware, contactApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;