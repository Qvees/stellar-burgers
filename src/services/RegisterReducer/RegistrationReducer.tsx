import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TAuthResponse,
  TLoginData,
  TRegisterData,
  forgotPasswordApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

export interface UserData {
  isAuthChecked: boolean; //авторизован ли
  registrationData: TRegisterData | null; // данные прирегистрации
  user: TUser | null; //данные пользователя для личного кабинета
  userData: TAuthResponse | null; //полные данные пользователя с сервера
  isLoading: boolean;
  error: string | null;
  isLoginUser: boolean;
}

export const initialState: UserData = {
  isAuthChecked: false,
  isLoginUser: false,
  registrationData: null,
  user: null,
  userData: null,
  isLoading: false,
  error: ''
};
//регистрация
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: TRegisterData) => {
    const registerUserData = await registerUserApi(userData);
    return registerUserData;
  }
);
//вход в аккаунт
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    return response;
  }
);
//выход из аккаунта
export const logOutUser = createAsyncThunk('logOut/logOutUser', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return response;
});

// обновить данные пользователя на новые
export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (user: TRegisterData) => {
    const response = await updateUserApi(user);
    return response;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPasswaord',
  async (data: { password: string; token: string }) => {
    const response = resetPasswordApi(data);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    },
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
    },
    newUserData(state, action: PayloadAction<TRegisterData>) {
      state.registrationData = action.payload;
    },
    logOut: (state) => {
      state.userData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.isLoading = false;
          state.userData = action.payload;
          state.user = action.payload.user;
          state.isLoginUser = true;
        }
      )
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.userData = null;
        state.isLoginUser = false;
        state.user = null;
      })
      .addCase(logOutUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUserData.rejected, (state) => {
        state.isLoading = false;
        state.error = 'ошибка';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {})
      .addCase(forgotPassword.rejected, (state) => {
        state.error = 'ошибка';
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {})
      .addCase(resetPassword.rejected, (state) => {
        state.error = 'ошибка';
        state.isLoading = false;
      });
  },
  selectors: {
    getUserData: (state) => state.user,
    getAuthChecked: (state) => state.isAuthChecked
  }
});

export default authSlice.reducer;
export const { getUserData, getAuthChecked } = authSlice.selectors;
export const { setUser, logOut, setAuthChecked, newUserData } =
  authSlice.actions;
