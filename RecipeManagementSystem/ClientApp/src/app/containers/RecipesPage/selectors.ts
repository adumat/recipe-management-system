import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.recipesPage || initialState;

export const selectRecipesPage = createSelector(
  [selectDomain],
  recipesPageState => recipesPageState,
);

export const selectRecipeOnEdit = createSelector(
  [selectDomain],
  recipesPageState => recipesPageState.currentProps,
);

export const selectFetchedIngredients = createSelector(
  [selectDomain],
  ingredientsPageState => ingredientsPageState.FetchedIngredients,
);

export const selectFetchedRecipeTags = createSelector(
  [selectDomain],
  ingredientsPageState => ingredientsPageState.FetchedRecipeTags,
);