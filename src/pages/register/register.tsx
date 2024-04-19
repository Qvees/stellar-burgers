import { FC, SyntheticEvent, useState } from 'react';
import { createDispatchHook, useSelector } from 'react-redux';
import { RegisterUI } from '@ui-pages';
import { RootState } from 'src/services/store';
import { registerUser } from '../../components/Reducers/RegisterReducer/RegistrationReducer';
import { TRegisterData } from '@api';
import { useDispatch } from '../../services/store';
export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TRegisterData = {
      email: email,
      password: password,
      name: userName
    };
    dispatch(registerUser(userData));
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
