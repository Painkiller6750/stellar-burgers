import { configureStore, type AppDispatch } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';
import authReducer from './slices/authSlice';

// --- Store configuration ---
export const store = configureStore({
    reducer: {
        ingredients: ingredientsReducer,
        orders: ordersReducer,
        auth: authReducer,
    },
});

// --- Type definitions ---
export type RootState = ReturnType<typeof store.getState>;

// --- Typed hooks ---
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <TSelected>(
    fn: (state: RootState) => TSelected
) => useSelector(fn);
