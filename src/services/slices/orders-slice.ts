import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  orderData: TOrder | null;
  orderModalData: TOrder | null;
  isLoading: boolean;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  orderData: null,
  orderModalData: null,
  isLoading: false,
  orderRequest: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', getOrdersApi);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    const order = response.order;

    return {
      _id: order._id,
      status: order.status,
      name: order.name,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      number: order.number,
      ingredients
    } as TOrder;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderData = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const { clearOrderModalData, clearOrderData } = ordersSlice.actions;
export default ordersSlice.reducer;
