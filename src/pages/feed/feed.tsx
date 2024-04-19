import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, RootState } from '../../services/store';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import {
  fetchAllOrders,
  getFeed
} from '../../components/Reducers/OrderReducer/OrderReducer';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.orders.ordersData?.orders || []
  );

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchAllOrders())} />
  );
};
