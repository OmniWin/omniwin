// sidebarSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserSettingsState {
  userSettings: {
    style: number; // 1 = mw, 2 = es, 3 = def
    display: string;
  };
  user: object;
  isWalletConnectorModalOpen: boolean;
  isWalletStatusModalOpen: boolean;
  usedReferralCode: string;
}

const initialState: UserSettingsState = {
  userSettings: {
    style: 1,
    display: 'grid',
  },
  user: {},
  isWalletConnectorModalOpen: false,
  isWalletStatusModalOpen: false,
  usedReferralCode: '',
};

const localStorageState = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('userSettings') ?? '{}') : {};
const state = Object.assign({}, initialState, localStorageState)

export const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState: state,
  reducers: {
    setCardStyle: (state, action: PayloadAction<number>) => {
      state.userSettings.style = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    setCardDisplay: (state, action: PayloadAction<string>) => {
      state.userSettings.display = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    setWalletConnectorModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWalletConnectorModalOpen = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    setUsedReferralCode: (state, action: PayloadAction<string>) => {
      state.usedReferralCode = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    setWalletStatusModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWalletStatusModalOpen = action.payload;
      localStorage.setItem('userSettings', JSON.stringify(state));
    }
  },
});

export const {
  setCardStyle, setCardDisplay, setUser, setWalletConnectorModalOpen, setUsedReferralCode, setWalletStatusModalOpen
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;