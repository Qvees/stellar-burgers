import { RootState } from 'src/services/store';
import ordersReducer, { initialState } from './OrderReducer';
import {
  fetchAllOrders,
  getUserOrder,
  doOrder,
  feed,
  getFeed,
  numberOrder
} from './OrderReducer';
import { describe, expect, it } from '@jest/globals';

describe('ordersSlice', () => {
  const mockOrderData = {
    _id: '1',
    name: 'Test Order',
    ingredients: ['ingredient1', 'ingredient2'],
    totalPrice: 10,
    createdAt: '2024-05-01T12:00:00',
    updatedAt: '2024-05-01T12:30:00',
    status: 'pending',
    number: 1
  };

  const mockUserNewOrder = {
    success: true,
    order: mockOrderData,
    name: 'Test User'
  };

  const mockOrdersData = {
    success: true,
    orders: [mockOrderData],
    total: 1,
    totalToday: 1
  };

  const mockOrderByNumber = [mockOrderData];

  it('должен обрабатывать ожидание fetchAllOrders', () => {
    const nextState = ordersReducer(
      initialState,
      fetchAllOrders.pending('data')
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать успешное выполнение fetchAllOrders', () => {
    const ordersData = {
      success: true,
      orders: [mockOrderData],
      total: 10,
      totalToday: 50
    };
    const requestId = 'id';
    const nextState = ordersReducer(
      initialState,
      fetchAllOrders.fulfilled(ordersData, requestId)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(null);
    expect(nextState.ordersData).toEqual(ordersData);
  });

  it('должен обрабатывать ошибку fetchAllOrders', () => {
    const error = 'ошибка';
    const nextState = ordersReducer(
      initialState,
      fetchAllOrders.rejected(null, error)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it('должен обрабатывать ожидание getUserOrder', () => {
    const nextState = ordersReducer(initialState, getUserOrder.pending('data'));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать успешное выполнение getUserOrder', () => {
    const userOrders = [
      {
        _id: '1',
        status: '',
        name: 'test',
        createdAt: '10:41',
        updatedAt: '10:50',
        number: 1,
        ingredients: []
      }
    ];
    const requestId = 'id';
    const nextState = ordersReducer(
      initialState,
      getUserOrder.fulfilled(userOrders, requestId)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.userOrders).toEqual(userOrders);
  });

  it('должен обрабатывать feed', () => {
    const nextState = ordersReducer(initialState, feed(mockOrdersData));
    expect(nextState.ordersData).toEqual(mockOrdersData);
  });

  it('должен возвращать правильное значение для селектора getFeed', () => {
    const state = {
      order: {
        ...initialState,
        ordersData: mockOrdersData // установка начального состояния
      }
    };
    const feedData = getFeed(state);
    expect(feedData).toEqual(mockOrdersData.orders);
  });

  it('должен возвращать правильное значение для селектора numberOrder', () => {
    const state = {
      order: {
        ...initialState,
        orderByNumber: mockOrderByNumber // установка начального состояния
      }
    };
    const orderData = numberOrder(state);
    expect(orderData).toEqual(mockOrderByNumber);
  });

  it('должен обрабатывать ожидание doOrder', () => {
    const nextState = ordersReducer(initialState, doOrder.pending('data', []));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать успешное выполнение doOrder', () => {
    const nextState = ordersReducer(
      initialState,
      doOrder.fulfilled(mockUserNewOrder, 'requestId', [])
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.userNewOrder).toEqual(mockUserNewOrder);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать ошибку doOrder', () => {
    const error = 'ошибка';
    const nextState = ordersReducer(
      initialState,
      doOrder.rejected(null, error, [])
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(error);
  });
});
