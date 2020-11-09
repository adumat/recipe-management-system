import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.ingredientsPage || initialState;

export const selectIngredientsPage = createSelector(
  [selectDomain],
  ingredientsPageState => ingredientsPageState,
);

export const selectIngredientOnEdit = createSelector(
  [selectDomain],
  ingredientsPageState => ingredientsPageState.currentProps,
);

export const selectFetchedIngredientCategories = createSelector(
  [selectDomain],
  ingredientsPageState => ingredientsPageState.FetchedIngredientCategories,
);