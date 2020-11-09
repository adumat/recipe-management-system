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

export interface RecipeStep {
  Id?: number;
  Description: string;
  OrderIdx: number;
}

export enum UnitOfMeasure {
  GRAMS = 1,
  LITER = 2,
  MILLI_LITER = 3,
  SPOON = 4,
  COUNT = 5,
}

export interface UseOfIngredient {
  IngredientId: number;
  Quantity: number;
  Unit: UnitOfMeasure;
}

export interface Recipe {
  Id?: number;
  Title: string;
  Introduction: string;
  FinalConsiderations: string;
  Tags: number[];
  PreparationSteps: RecipeStep[];
  UseOfIngredients: UseOfIngredient[];
}
