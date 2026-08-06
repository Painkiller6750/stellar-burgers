import { RootState } from './index';

// --- Ingredients selectors ---
export const selectIngredientsData = (state: RootState) => state.ingredients.data;
export const selectIsIngredientsLoading = (state: RootState) => state.ingredients.loading;
export const selectIngredientsError = (state: RootState) => state.ingredients.error;

// --- Feed orders selectors ---
export const selectFeedOrders = (state: RootState) => state.orders.feed?.allOrders ?? [];
export const selectOrdersLoadingFeed = (state: RootState) => state.orders.loadingFeed;
export const selectOrdersErrorFeed = (state: RootState) => state.orders.errorFeed;

// --- Profile orders selectors ---
export const selectProfileOrders = (state: RootState) => state.orders.profileOrders;
export const selectOrdersLoadingProfile = (state: RootState) => state.orders.loadingProfile;
export const selectOrdersErrorProfile = (state: RootState) => state.orders.errorProfile;

// --- Auth selectors ---
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUser = (state: RootState) => state.auth.user;
