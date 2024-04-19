import { FC, useMemo, useEffect, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  getIngredients
} from '../Reducers/BurgerReducer/BurgerReducer';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  closeModal,
  doOrder
} from '../../components/Reducers/OrderReducer/OrderReducer';
import { allowedNodeEnvironmentFlags } from 'process';
import { Modal } from '../modal';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(getConstructorItems);
  const isLoginUser = useSelector((state: RootState) => state.auth.isLoginUser);
  const order = useSelector((state: RootState) => state.orders.orderData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderRequest, setOrderRequest] = useState(false);
  const orderModalData = useSelector(
    (state: RootState) => state.orders.userNewOrder?.order || null
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isLoginUser) {
      navigate('/login');
      return;
    }
    const order: string[] = [
      constructorItems.bun!._id,
      ...constructorItems.ingredients.map(
        (ingredient: { _id: any }) => ingredient._id
      ),
      constructorItems.bun!._id
    ];
    dispatch(doOrder(order));
    setOrderRequest(true);
  };

  const closeOrderModal = () => {
    setOrderRequest(false);
    closeModal; // не закрывается модальное окно с информацией о заказе
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
