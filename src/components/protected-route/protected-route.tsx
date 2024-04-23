import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getAuthChecked,
  getUserData
} from '../../services/RegisterReducer/RegistrationReducer';
import { Preloader } from '../ui/preloader';
import { useState } from 'react';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(getAuthChecked);
  const user = useSelector(getUserData);
  const location = useLocation();
  const [wasOnForgotPassword, setWasOnForgotPassword] = useState(false);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    // для неаутентифицированных пользователей, но мы аутентифицированы
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user) {
    // для  аутентифицированных, но мы не аутентифицированы
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если пользователь заходит на страницу reset-password, проверяем, был ли он уже на странице forgot-password
  if (onlyUnAuth && !user && location.pathname === '/reset-password') {
    if (!wasOnForgotPassword) {
      // Если пользователь не был на странице forgot-password, перенаправляем его на нее
      return <Navigate to='/forgot-password' />;
    } else {
      // Если пользователь был на странице forgot-password, разрешаем переход на reset-password
      return component;
    }
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;

export const OnlyUnAuth = ({ component }: { component: React.JSX.Element }) => (
  <ProtectedRoute onlyUnAuth component={component} />
);
