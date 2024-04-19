import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import {
  loginUser,
  setUser
} from '../../components/Reducers/RegisterReducer/RegistrationReducer';
import { Navigate, useLocation } from 'react-router-dom';
import { TUser } from '@utils-types';
import { TAuthResponse, TRegisterData } from '@api';
import { getCookie } from '../../utils/cookie';
import { getUserOrder } from '../../components/Reducers/OrderReducer/OrderReducer';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
