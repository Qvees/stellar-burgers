import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TAuthResponse,
  TLoginData,
  TOrdersResponse,
  TRegisterData,
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi
} from '../../utils/burger-api';
import { RootState } from 'src/services/store';
import { TOrder, TOrdersData } from '@utils-types';
import { access } from 'fs';
import { BooleanLiteral } from 'typescript';

//много лишних типов наверное
export interface allOrdersData {
  isLoading: boolean;
  error: string | null;
  orderData: TOrder | null; // информация 1 заказа
  ordersData: TOrdersData | null; // информация о всех заказах
  orderByNumber: TOrder[] | null; // информация о каазках по номеру
  userOrders: TOrder[] | null; // информация о пользовательских заказах
  userNewOrder:
    | ({
        success?: Boolean;
      } & {
        order: TOrder;
        name: string;
      })
    | null;
  orders: TOrdersData | null;
}

const initialState: allOrdersData = {
  orderByNumber: null,
  orderData: null,
  ordersData: null,
  userOrders: null,
  userNewOrder: null,
  isLoading: false,
  error: null,
  orders: null
};

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrder',
  async () => {
    const response = getFeedsApi();
    return response;
  }
);

export const getUserOrder = createAsyncThunk('order/UserOrder', async () => {
  const response = await getOrdersApi();
  return response;
});

export const doOrder = createAsyncThunk(
  'order/doOrder',
  async (data: string[]) => {
    const response = orderBurgerApi(data);
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = getOrderByNumberApi(number);
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    feed: (state, action) => {
      state.ordersData = action.payload;
    },
    closeModal: (state) => {
      state.orderData = null;
      state.userNewOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(getUserOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrder.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(getUserOrder.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(doOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(doOrder.fulfilled, (state, action) => {
        state.userNewOrder = action.payload;
      })
      .addCase(doOrder.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.error = 'ошибка';
        state.isLoading = false;
      });
  },
  selectors: {
    getFeed: (state) => state.ordersData?.orders,
    numberOrder: (state) => state.orderByNumber
  }
});

export default ordersSlice.reducer;
export const { getFeed, numberOrder } = ordersSlice.selectors;
export const { feed, closeModal } = ordersSlice.actions;
