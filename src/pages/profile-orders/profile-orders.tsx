import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getOrderByNumber } from '../../components/Reducers/OrderReducer/OrderReducer';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.orders.userOrders || []
  );

  return <ProfileOrdersUI orders={orders} />;
};
