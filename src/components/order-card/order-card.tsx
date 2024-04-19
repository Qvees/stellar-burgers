import { FC, memo, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { getIngredient } from '../Reducers/BurgerReducer/BurgerReducer';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getOrderByNumber } from '../Reducers/OrderReducer/OrderReducer';

const maxIngredients = 6;
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const ingredients = useSelector(getIngredient);
  const orderData = useSelector((state: RootState) => state.orders.orderData);
  useEffect(() => {
    dispatch(getOrderByNumber(order.number));
  }, [dispatch]);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
