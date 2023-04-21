import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { rootReducer } from './reducers/Reducers';

const persistConfig = {
  key: 'root',
  storage,
};

// const persistedReducer = persistReducer(persistConfig, {});

export const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
  devTools: true,
  middleware: [ thunk ],
});

export const persistor = persistStore( store );
