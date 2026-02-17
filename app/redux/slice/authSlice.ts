import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/auth';
import { store } from '../store/store';
import { clearLoginData } from '../../utils/localDB';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      clearLoginData();
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
export type RootState = ReturnType<typeof store.getState>;
