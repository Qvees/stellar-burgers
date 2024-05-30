import { TUser } from '@utils-types';
import authReducer, {
  initialState,
  registerUser,
  loginUser,
  logOutUser,
  updateUserData,
  forgotPassword,
  resetPassword,
  setUser,
  logOut,
  setAuthChecked,
  newUserData,
  getUserData,
  getAuthChecked
} from './RegistrationReducer';
import { describe, expect, it } from '@jest/globals';

describe('authSlice', () => {
  const mockAuthResponse = {
    refreshToken: 'refreshTokenValue',
    accessToken: 'accessTokenValue',
    success: true,
    user: {
      name: 'Test User',
      email: 'test@example.com'
    }
  };
  const mockUserData: TUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockLoginData = {
    name: 'test',
    email: 'test',
    password: 'test123'
  };

  const mockRegisterData = {
    name: 'test_user',
    email: 'test@test.com',
    password: 'password',
    success: true
  };

  it('должен обрабатывать ожидание registerUser', () => {
    const nextState = authReducer(
      initialState,
      registerUser.pending('data', initialState.registrationData!)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe('');
  });

  it('должен обрабатывать успешное выполнение registerUser', () => {
    const nextState = authReducer(
      initialState,
      registerUser.fulfilled(mockAuthResponse, '1', mockRegisterData)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.userData).toEqual(mockAuthResponse);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать ошибку registerUser', () => {
    const nextState = authReducer(
      initialState,
      registerUser.rejected(null, 'ошибка', initialState.registrationData!)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('ошибка');
  });

  it('должен обрабатывать ожидание loginUser', () => {
    const nextState = authReducer(
      initialState,
      loginUser.pending('', mockLoginData)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать успешное выполнение loginUser', () => {
    const nextState = authReducer(
      initialState,
      loginUser.fulfilled(mockAuthResponse, '', mockRegisterData)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.userData).toEqual(mockAuthResponse);
    expect(nextState.error).toBe('');
  });

  it('должен обрабатывать ошибку loginUser', () => {
    const nextState = authReducer(
      initialState,
      loginUser.rejected(null, 'ошибка', mockLoginData)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('ошибка');
  });

  it('должен обрабатывать ожидание logOutUser', () => {
    const nextState = authReducer(initialState, logOutUser.pending(''));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать успешное выполнение logOutUser', () => {
    const nextState = authReducer(
      initialState,
      logOutUser.fulfilled({ success: true }, '')
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.userData).toBe(null);
    expect(nextState.isLoginUser).toBe(false);
    expect(nextState.user).toBe(null);
  });

  it('должен обрабатывать ошибку logOutUser', () => {
    const nextState = authReducer(
      initialState,
      logOutUser.rejected(null, 'ошибка')
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('ошибка');
  });

  it('должен обрабатывать ожидание updateUserData', () => {
    const nextState = authReducer(
      initialState,
      updateUserData.pending('', mockRegisterData)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать успешное выполнение updateUserData', () => {
    const nextState = authReducer(
      initialState,
      updateUserData.fulfilled(mockAuthResponse, '', mockRegisterData)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(mockUserData);
  });

  it('должен обрабатывать ошибку updateUserData', () => {
    const nextState = authReducer(
      initialState,
      updateUserData.rejected(null, 'ошибка', mockRegisterData)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('ошибка');
  });

  it('должен обрабатывать ожидание forgotPassword', () => {
    const nextState = authReducer(
      initialState,
      forgotPassword.pending('', { email: 'test' })
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать ошибку forgotPassword', () => {
    const nextState = authReducer(
      initialState,
      forgotPassword.rejected(null, 'ошибка', { email: 'test' })
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('ошибка');
  });

  it('должен обрабатывать ожидание resetPassword', () => {
    const nextState = authReducer(
      initialState,
      resetPassword.pending('', { password: 'test123', token: 'testToken' })
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('должен обрабатывать ошибку resetPassword', () => {
    const nextState = authReducer(
      initialState,
      resetPassword.rejected(null, 'ошибка', {
        password: 'test123',
        token: 'testToken'
      })
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('ошибка');
  });

  it('должен устанавливать пользователя', () => {
    const nextState = authReducer(initialState, setUser(mockUserData));
    expect(nextState.user).toEqual(mockUserData);
  });

  it('должен устанавливать статус проверки аутентификации', () => {
    const nextState = authReducer(initialState, setAuthChecked(true));
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('должен устанавливать данные регистрации', () => {
    const nextState = authReducer(initialState, newUserData(mockRegisterData));
    expect(nextState.registrationData).toEqual(mockRegisterData);
  });
});
