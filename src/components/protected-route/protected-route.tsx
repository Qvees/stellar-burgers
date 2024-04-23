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

  // Проверяем, был ли пользователь на странице forgot-password перед переходом на reset-password
  const fromForgotPassword =
    location.state && location.state.from.pathname === '/forgot-password';

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    // для неаутентифицированных пользователей, но мы аутентифицированы
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user) {
    // Если пользователь не был на странице forgot-password, перенаправляем на эту страницу
    if (location.pathname === '/reset-password' && !fromForgotPassword) {
      setWasOnForgotPassword(true);
      return <Navigate to='/forgot-password' />;
    }
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // if (onlyUnAuth && !user) {
  //   return <Navigate to='/reset-password' state={{ from: location }} />;
  // }

  // // if (onlyUnAuth && !user) {
  // //   // для неаутентифицированных и не пользователей
  // //   return <Navigate to='/profile' />;
  // // }

  return component;
};

export const OnlyAuth = ProtectedRoute;

export const OnlyUnAuth = ({ component }: { component: React.JSX.Element }) => (
  <ProtectedRoute onlyUnAuth component={component} />
);
