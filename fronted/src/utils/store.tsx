import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice';
import doctorSlice from './doctorSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';


// 1. Combine all reducers
const rootReducer = combineReducers({
  user: authSlice,
doctor:doctorSlice,
  
});
// 2. Create persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user','doctor'], // persist 'user'
};
// 3. Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);



export const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // important for redux-persist
      }),  
  })
  export const persistor = persistStore(store);

  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatch = typeof store.dispatch