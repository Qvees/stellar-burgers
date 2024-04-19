import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getIngredients } from '../Reducers/BurgerReducer/BurgerReducer';
import { getOrderByNumber } from '../Reducers/OrderReducer/OrderReducer';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>(); // Получаем номер заказа из URL

  const orderData: TOrder | null = useSelector((state: RootState) => {
    const orderNumber = parseInt(number!, 10);
    const orders = state.orders.orderByNumber ?? [];
    return orders.find((order) => order.number === orderNumber) ?? null;
  });

  const ingredients: TIngredient[] = useSelector((state: RootState) => {
    const orderNumber = parseInt(number!, 10);
    const orders = state.orders.orderByNumber ?? [];
    const order = orders.find((order) => order.number === orderNumber);
    return order
      ? order.ingredients
          .map((id) => state.burger.ingredients.find((ing) => ing._id === id))
          .filter(
            (ingredient): ingredient is TIngredient => ingredient !== undefined
          )
      : [];
  });
  // была ошибка в терминале про разные данные, пытался исправить
  const memoizedOrderData = useMemo(() => orderData, [orderData]);
  const memoizedIngredients = useMemo(() => ingredients, [ingredients]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!memoizedOrderData || !memoizedIngredients.length) return null;
    const date = new Date(memoizedOrderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = memoizedIngredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item._id]) {
          acc[item._id] = {
            ...item,
            count: 1
          };
        } else {
          acc[item._id].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...memoizedOrderData,
      ingredientsInfo,
      date,
      total
    };
  }, [memoizedOrderData, memoizedIngredients]);

  // вроде должен диспатчить когда получаю номер заказа 1 а диспатчится все.
  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(parseInt(number, 10)));
    }
  }, []);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
