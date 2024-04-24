import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  getConstructorItems,
  removeIngredient
} from '../../services/BurgerReducer/BurgerReducer';
import { useNavigate } from 'react-router-dom';
import { closeModal, doOrder } from '../../services/OrderReducer/OrderReducer';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(getConstructorItems);
  const isLoginUser = useSelector((state) => state.auth.user);
  const order = useSelector((state) => state.orders.orderData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderRequest, setOrderRequest] = useState(false);
  const orderModalData = useSelector(
    (state) => state.orders.userNewOrder?.order || null
  );

  const onOrderClick = () => {
    if (!constructorItems.ingredients.length || orderRequest) return;
    if (!isLoginUser) {
      navigate('/login');
      return;
    }
    const order: string[] = [
      constructorItems.bun!._id,
      ...constructorItems.ingredients.map(
        (ingredient: { _id: string }) => ingredient._id
      ),
      constructorItems.bun!._id
    ];
    dispatch(doOrder(order));
    setOrderRequest(true);
  };

  const closeOrderModal = () => {
    setOrderRequest(false);
    dispatch(clearConstructor());
    dispatch(closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
