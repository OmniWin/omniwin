// sidebarSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserSettingsState {
  userSettings: Object;
}

const initialState: UserSettingsState = {
  userSettings: {},
};

export const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    setUserSettingsState: (state, action: PayloadAction<boolean>) => {
      state.userSettings = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(action.payload));
    },
  },
});

export const { setUserSettingsState } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;