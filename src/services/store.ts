import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerReducer from '../components/Reducers/BurgerReducer/BurgerReducer';
import authReducer from '../components/Reducers/RegisterReducer/RegistrationReducer';
import ordersReducer from '../components/Reducers/OrderReducer/OrderReducer';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объявляем корневой редюсер
const rootReducer = combineReducers({
  burger: burgerReducer,
  auth: authReducer,
  orders: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;