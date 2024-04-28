/* Core */
import {
  configureStore,
  type ThunkAction,
  type Action,
} from "@reduxjs/toolkit";
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from "react-redux";

const preloadedState = () => {
  const userSettingsData = localStorage.getItem('userSettings');
  const isSidebarOpenData = localStorage.getItem('isSidebarOpen');
  const toggleSidebarData = localStorage.getItem('toggleSidebar');

  return {
    userSettings: userSettingsData ? JSON.parse(userSettingsData) : undefined,
    sidebar: {
      isSidebarOpen: isSidebarOpenData ? JSON.parse(isSidebarOpenData) : false, // Default to false if not found
      toggleSidebar: toggleSidebarData ? JSON.parse(toggleSidebarData) : false, // Default to false if not found
    }
  };
};

/* Instruments */
import { reducer } from "./rootReducer";
import { middleware } from "./middleware";

export const reduxStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
  preloadedState: preloadedState() // This will set your initial state based on localStorage
});
export const useDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

/* Types */
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;
