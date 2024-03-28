/* Instruments */
import { sidebarSlice } from "./slices";
import { userSettingsSlice } from "./slices";

export const reducer = {
  isSidebarOpen: sidebarSlice.reducer,
  sidebarToggle: sidebarSlice.reducer,
  userSettings: userSettingsSlice.reducer,
};
