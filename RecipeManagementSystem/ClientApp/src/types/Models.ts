export interface IdEditorParamTypes {
  Id: string;
}

export interface IngredientCategory {
  Id?: number;
  Name: string;
}

export interface Ingredient {
  Id?: number;
  Name: string;
  CategoryId?: number;
}

export interface RecipeTag {
  Id?: number;
  Name: string;
  Description: string;
  ParentTagId?: number;
}