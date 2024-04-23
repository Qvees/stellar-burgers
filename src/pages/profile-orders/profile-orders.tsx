import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  getOrderByNumber,
  getUserOrder
} from '../../services/OrderReducer/OrderReducer';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOrder());
  }, []);
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.orders.userOrders || []
  );

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
