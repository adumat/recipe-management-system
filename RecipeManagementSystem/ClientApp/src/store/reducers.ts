/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';
import { InjectedReducersType } from 'utils/types/injector-typings';
import { reducer as NotificationReducer } from './notifications';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  /*if (Object.keys(injectedReducers).length === 0) {
    return state => state;
  } else {*/
  return combineReducers({
    ...injectedReducers,
    notifications: NotificationReducer,
  });
  // }
}
