import { RecipesPageState } from 'app/containers/RecipesPage/types';
import { IngredientsPageState } from 'app/containers/IngredientsPage/types';
import { RecipeTagsPageState } from 'app/containers/RecipeTagsPage/types';
import { IngredientCategoriesPageState } from 'app/containers/IngredientCategoriesPage/types';
import { OptionsObject } from 'notistack';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface Notification {
  key: number;
  message: string;
  dismissed?: boolean;
  options?: OptionsObject;
}
export type NotificationsState = Notification[];

export interface RootState {
  notifications: NotificationsState;
  recipesPage?: RecipesPageState;
  ingredientsPage?: IngredientsPageState;
  recipeTagsPage?: RecipeTagsPageState;
  ingredientCategoriesPage?: IngredientCategoriesPageState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
