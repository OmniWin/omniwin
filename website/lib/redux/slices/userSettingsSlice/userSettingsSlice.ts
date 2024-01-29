// sidebarSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserSettingsState {
  userSettings: {
    style: number; // 1 = mw, 2 = es, 3 = def
    display: string;
  };
}

const initialState: UserSettingsState = {
  userSettings: {
    style: 1,
    display: 'grid',
  },
};

export const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    setCardStyle: (state, action: PayloadAction<number>) => {
      state.userSettings.style = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
    },
    setCardDisplay: (state, action: PayloadAction<string>) => {
      state.userSettings.display = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
    },
  },
});

export const {
  setCardStyle, setCardDisplay
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;