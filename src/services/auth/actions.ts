import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchWithRefresh, getUserApi } from '../../utils/burger-api';
import { TOrder, TUser } from '@utils-types';
import { log } from 'console';
import { RootState } from 'src/services/store';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { useDispatch } from '../store';
import {
  setAuthChecked,
  setUser
} from '../RegisterReducer/RegistrationReducer';

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

// export const fetchWithToken = createAsyncThunk(
//   'fetchWithToken',
//   async ({ url, options }: { url: RequestInfo; options: RequestInit }) => {
//     const res = await fetchWithRefresh(url, options); // Используем функцию fetchWithRefresh для выполнения запроса
//     return res; // Возвращаем результат
//   }
// );
