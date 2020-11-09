/* --- STATE --- */

import { IngredientCategory } from 'types';

export interface IngredientCategoriesPageState {
  FetchedIngredients: IngredientCategory[];
  currentProps: IngredientCategory;
}

export type ContainerState = IngredientCategoriesPageState;
