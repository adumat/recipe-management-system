import { Ingredient, IngredientCategory } from 'types/Models';

/* --- STATE --- */
export interface IngredientsPageState {
  FetchedIngredients: Ingredient[];
  FetchedIngredientCategories: IngredientCategory[];
  currentProps: Ingredient;
}

export type ContainerState = IngredientsPageState;
