import { Ingredient, Recipe, RecipeTag } from 'types/Models';

/* --- STATE --- */
export interface RecipesPageState {
  FetchedRecipes: Recipe[];
  FetchedRecipeTags: RecipeTag[];
  FetchedIngredients: Ingredient[];
  currentProps: Recipe;
}

export type ContainerState = RecipesPageState;
