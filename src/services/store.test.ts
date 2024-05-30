import store from './store';
import { expect, test, describe, jest } from '@jest/globals';
import { rootReducer, RootState } from './store';
import '@testing-library/jest-dom';
import { Button } from '@zlden/react-developer-burger-ui-components';

describe('rootReducer', () => {
  it('проверка на правильную инициализацию rootReducer', () => {
    const combinedReducer = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    // проверка что есть ключи;
    expect(combinedReducer).toHaveProperty('burger');
    expect(combinedReducer).toHaveProperty('auth');
    expect(combinedReducer).toHaveProperty('orders');

    //проверка  что каждый редюсер включен в корневой редюсер и что они доступны по соответствующим ключам.
    expect(combinedReducer.burger);
    expect(combinedReducer.auth);
    expect(combinedReducer.orders);
  });
});
