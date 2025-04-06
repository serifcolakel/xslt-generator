import { postsApi } from "@/features/api/postApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = {
  [postsApi.reducerPath]: postsApi.reducer,
};

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([postsApi.middleware]),
  reducer: combineReducers(rootReducer),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
