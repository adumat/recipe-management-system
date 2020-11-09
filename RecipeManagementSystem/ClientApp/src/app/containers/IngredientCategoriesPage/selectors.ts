import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.ingredientCategoriesPage || initialState;

export const selectIngredientCategoriesPage = createSelector(
  [selectDomain],
  ingredientCategoriesPageState => ingredientCategoriesPageState,
);

export const selectIngredientCategoryOnEdit = createSelector(
  [selectDomain],
  ingredientCategoriesPageState => ingredientCategoriesPageState.currentProps,
);