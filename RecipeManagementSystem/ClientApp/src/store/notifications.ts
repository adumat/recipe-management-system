import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { NotificationsState, Notification, RootState } from 'types/RootState';

export const initialState: NotificationsState = [];

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    enqueueSnackbar(state, action: PayloadAction<Notification>) {
      return [...state, action.payload];
    },
    closeSnackbar(state, action: PayloadAction<number | null>) {
      return state.map(notification =>
        action.payload === null || notification.key === action.payload
          ? { ...notification, dismissed: true }
          : { ...notification },
      );
    },
    removeSnackbar(state, action: PayloadAction<number>) {
      return state.filter(notification => notification.key !== action.payload);
    },
  },
});

export const { actions, reducer, name: sliceKey } = notificationSlice;

const selectDomain = (state: RootState) => state.notifications || initialState;

export const selectNotifications = createSelector(
  [selectDomain],
  notification => notification,
);
