import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import {
  getUserData,
  newUserData,
  updateUserData
} from '../../services/RegisterReducer/RegistrationReducer';
import { useDispatch } from '../../services/store';
import {
  getOrderByNumber,
  getUserOrder
} from '../../services/OrderReducer/OrderReducer';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const user = useSelector((state: RootState) => state.auth.user);
  const updateUser = useSelector(
    (state: RootState) => state.auth.registrationData
  );
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(newUserData(formValue));
    if (updateUser) {
      dispatch(updateUserData(updateUser));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};
