import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    TypedUseSelectorHook,
    useDispatch as useDispatchBase,
    useSelector as useSelectorBase,
} from 'react-redux';

import {
    constructorReducer,
    feedReducer,
    ingredientsReducer,
    ordersReducer,
    userReducer,
} from './slices';

// --- Reducers composition ---
const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    feed: feedReducer,
    orders: ordersReducer,
    user: userReducer,
});

// --- Store initialization ---
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

// --- Type definitions for hooks ---
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// --- Typed hooks ---
export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export default store;
