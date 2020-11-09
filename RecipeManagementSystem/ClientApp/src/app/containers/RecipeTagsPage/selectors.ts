import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.recipeTagsPage || initialState;

export const selectRecipeTagsPage = createSelector(
  [selectDomain],
  recipeTagsPageState => recipeTagsPageState,
);

export const selectRecipeTagOnEdit = createSelector(
  [selectDomain],
  recipeTagsPageState => recipeTagsPageState.currentProps,
);