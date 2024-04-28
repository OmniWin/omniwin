// sidebarSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: boolean;
  isChatOpen: boolean;
}

const initialState: SidebarState = {
  isSidebarOpen: false,
  toggleSidebar: false,
  isChatOpen: false,
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
    setChatOpenState: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
      localStorage.setItem('isChatOpen', JSON.stringify(action.payload));
    }
  },
});

export const { setSidebarOpenState, setSidebarToggleState, setChatOpenState } = sidebarSlice.actions;

export default sidebarSlice.reducer;