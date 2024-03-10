// sidebarSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserSettingsState {
  userSettings: {
    style: number; // 1 = mw, 2 = es, 3 = def
    display: string;
    jwt: string;
    user: object;
  };
}

const initialState: UserSettingsState = {
  userSettings: {
    style: 1,
    display: 'grid',
    jwt: '',
    user: {},
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
    setJwt: (state, action: PayloadAction<string>) => {
      state.userSettings.jwt = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
    },
    setUser: (state, action: PayloadAction<object>) => {
      state.userSettings.user = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
    }
  },
});

export const {
  setCardStyle, setCardDisplay, setJwt, setUser
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;