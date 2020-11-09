import { RecipeTag } from 'types/Models';

/* --- STATE --- */
export interface RecipeTagsPageState {
  FetchedRecipeTags: RecipeTag[];
  currentProps: RecipeTag;
}

export type ContainerState = RecipeTagsPageState;
