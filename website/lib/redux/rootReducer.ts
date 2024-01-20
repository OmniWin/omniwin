/* Instruments */
import { counterSlice } from "./slices";
import { sidebarSlice } from "./slices";

export const reducer = {
  counter: counterSlice.reducer,
  isSidebarOpen: sidebarSlice.reducer,
  sidebarToggle: sidebarSlice.reducer,
};
