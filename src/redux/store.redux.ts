import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { initialStateSystem, reducerSystem } from './system/system.slice';
import { initialStateAccount, reducerAccount } from './account/account.slice';
import { useDispatch } from 'react-redux';
import { GlobalReduxState } from './store.interface';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  migrate: (state: GlobalReduxState) => {
    if (!state) return Promise.resolve(undefined);

    state.account = { ...initialStateAccount, ...state.account };
    state.system = { ...initialStateSystem, ...state.system };
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  account: reducerAccount,
  system: reducerSystem,
});

const persistedReducer = persistReducer(persistConfig as any, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);
