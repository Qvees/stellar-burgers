import { useSelector } from '../../services/store';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  getAuthChecked,
  getUserData
} from '../Reducers/RegisterReducer/RegistrationReducer';
import { RootState } from '../../services/store';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { useEffect } from 'react';
import { Preloader } from '../ui/preloader';

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
