import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/auth';
import { store } from '../store/store';
import { clearLoginData } from '../../utils/localDB';
import { ProfileEntity } from '../../types/profile.type';

interface ProfileState {
  profile: ProfileEntity | null;
}

const initialState: ProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileRedux: (state, action: PayloadAction<ProfileEntity | null>) => {
      state.profile = action.payload;
    }
  },
});

export const { setProfileRedux } = profileSlice.actions;
export default profileSlice.reducer;
export type RootState = ReturnType<typeof store.getState>;
