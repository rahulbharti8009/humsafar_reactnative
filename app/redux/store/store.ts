import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice.ts';
import profileReducer from '../slice/profileSlice.ts';


// ✅ Typed logger middleware
const loggerMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    console.log('Dispatching:', action);
    const result = next(action);
    console.log('Next state:', storeAPI.getState());
    return result;
  };

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

// ✅ Types for Redux usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
