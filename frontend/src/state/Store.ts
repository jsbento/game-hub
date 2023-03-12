import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
    key: 'root',
    storage,
};

// const persistedReducer = persistReducer(persistConfig, {});

export const store = configureStore({
    // reducer: persistedReducer,
    reducer: {},
    devTools: true,
    middleware: [thunk],
});

export const persistor = persistStore(store);