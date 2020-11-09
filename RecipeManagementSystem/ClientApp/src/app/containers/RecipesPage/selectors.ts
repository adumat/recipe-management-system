import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.recipesPage || initialState;

export const selectRecipesPage = createSelector(
  [selectDomain],
  recipesPageState => recipesPageState,
);
