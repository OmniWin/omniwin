// sidebarSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: boolean;
}

const initialState: SidebarState = {
  isSidebarOpen: false,
  toggleSidebar: false,
};
export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarOpenState: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
      localStorage.setItem('isSidebarOpen', JSON.stringify(action.payload));
    },
    setSidebarToggleState: (state, action: PayloadAction<boolean>) => {
      state.toggleSidebar = action.payload;
      localStorage.setItem('toggleSidebar', JSON.stringify(action.payload));
    },
  },
});

export const { setSidebarOpenState, setSidebarToggleState } = sidebarSlice.actions;

export default sidebarSlice.reducer;