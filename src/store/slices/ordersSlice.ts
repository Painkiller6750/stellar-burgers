import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersFeed } from '../../utils/burger-api';

export const fetchFeed = createAsyncThunk(
    'orders/fetchFeed',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getOrdersFeed();
            return res.data;
        } catch (e) {
            return rejectWithValue(e instanceof Error ? e.message : 'Ошибка ленты заказов');
        }
    }
);

// Аналогично можно добавить fetchProfileOrders, если его ещё нет
export const fetchProfileOrders = createAsyncThunk(
    'orders/fetchProfileOrders',
    async (_, { rejectWithValue }) => {
        // тут вызов своего API-метода
    }
);

const initialState = {
    feed: null,
    loadingFeed: false,
    errorFeed: null,
    profileOrders: [],
    loadingProfile: false,
    errorProfile: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state) => {
                state.loadingFeed = true;
                state.errorFeed = null;
            })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.loadingFeed = false;
                state.feed = action.payload;
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.loadingFeed = false;
                state.errorFeed = action.payload as string;
            });
        // добавь сюда extraReducers для fetchProfileOrders аналогично
    },
});

export default ordersSlice.reducer;
