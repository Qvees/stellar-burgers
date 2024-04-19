import React, { useEffect, useState } from 'react';
import { useDispatch } from '../../services/store';
import { fetchBurgerData } from '../Reducers/BurgerReducer/BurgerReducer'; // Подставьте путь к вашему файлу с экшенами

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { OnlyAuth, OnlyUnAuth } from '../ProtectedRoute/ProtectedRoute';
import {
  fetchAllOrders,
  getUserOrder
} from '../Reducers/OrderReducer/OrderReducer';
import { checkUserAuth, fetchWithToken } from '../auth/actions';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBurgerData());
  }, []);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, []);

  const handleModalClose = () => {
    navigate(-1);
  };
  // useEffect(() => {
  //   const refreshToken = localStorage.getItem('token');
  //   if (refreshToken) {
  //     dispatch(getUserThunk({ token }));
  //   } else {
  //     dispatch(init());
  //   }
  // }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route
          path='/feed/:number'
          element={
            <Modal title='заказ' onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Ингредиенты' onClose={handleModalClose}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <OnlyAuth
              component={
                <Modal title='номер заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
