import { PayloadAction } from '@reduxjs/toolkit';
import {
  Ingredient,
  Recipe,
  RecipeStep,
  RecipeTag,
  UnitOfMeasure,
  UseOfIngredient,
} from 'types/Models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the RecipesPage container
export const initialState: ContainerState = {
  FetchedRecipes: [],
  FetchedRecipeTags: [],
  FetchedIngredients: [],
  currentProps: {
    Id: undefined,
    Title: '',
    Introduction: '',
    FinalConsiderations: '',
    Tags: [],
    PreparationSteps: [],
    UseOfIngredients: [],
  },
};

const recipesPageSlice = createSlice({
  name: 'recipesPage',
  initialState,
  reducers: {
    fetchRecipesRequest(state, action: PayloadAction<void>) {},
    fetchRecipesResult(state, action: PayloadAction<Recipe[]>) {
      return {
        ...state,
        FetchedRecipes: action.payload,
      };
    },
    fetchRecipeTagsResult(state, action: PayloadAction<RecipeTag[]>) {
      return {
        ...state,
        FetchedRecipeTags: action.payload,
      };
    },
    fetchIngredientsResult(state, action: PayloadAction<Ingredient[]>) {
      return {
        ...state,
        FetchedIngredients: action.payload,
      };
    },
    loadRecipe(state: ContainerState, action: PayloadAction<string>) {
      return state;
    },
    newRecipe(state: ContainerState, action: PayloadAction<undefined>) {
      return {
        ...state,
        currentProps: {
          Id: undefined,
          Title: '',
          Introduction: '',
          FinalConsiderations: '',
          Tags: [],
          PreparationSteps: [],
          UseOfIngredients: [],
        },
      };
    },
    fillPropsRecipe(state: ContainerState, action: PayloadAction<Recipe>) {
      return {
        ...state,
        currentProps: action.payload,
      };
    },
    inputPropChanged(
      state: ContainerState,
      action: PayloadAction<{ prop: keyof Recipe; value: any }>,
    ) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          [action.payload.prop]: action.payload.value,
        },
      };
    },
    addUseOfIngredient(state: ContainerState, action: PayloadAction<void>) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          UseOfIngredients: [
            ...state.currentProps.UseOfIngredients.filter(
              ui => ui.IngredientId !== -1,
            ),
            {
              IngredientId: -1,
              Quantity: 0,
              Unit: UnitOfMeasure.COUNT,
            },
          ],
        },
      };
    },
    editUseOfIngredient(
      state: ContainerState,
      action: PayloadAction<{
        prop: keyof UseOfIngredient;
        value: any;
        originalObj: UseOfIngredient;
      }>,
    ) {
      const idOfOriginal = state.currentProps.UseOfIngredients.findIndex(
        ui => ui.IngredientId === action.payload.originalObj.IngredientId,
      );
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          UseOfIngredients: [
            ...state.currentProps.UseOfIngredients.slice(0, idOfOriginal),
            {
              ...action.payload.originalObj,
              [action.payload.prop]: action.payload.value,
            },
            ...state.currentProps.UseOfIngredients.slice(idOfOriginal + 1),
          ],
        },
      };
    },
    removeUseOfIngredient(
      state: ContainerState,
      action: PayloadAction<UseOfIngredient>,
    ) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          UseOfIngredients: state.currentProps.UseOfIngredients.filter(
            ui => ui.IngredientId !== action.payload.IngredientId,
          ),
        },
      };
    },
    addStep(state: ContainerState, action: PayloadAction<void>) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          PreparationSteps: [
            ...state.currentProps.PreparationSteps,
            {
              OrderIdx: state.currentProps.PreparationSteps.length,
              Description: '',
            },
          ],
        },
      };
    },
    editStep(
      state: ContainerState,
      action: PayloadAction<{
        prop: keyof RecipeStep;
        value: any;
        originalObj: RecipeStep;
      }>,
    ) {
      const idOfOriginal = state.currentProps.PreparationSteps.findIndex(
        ui => ui.OrderIdx === action.payload.originalObj.OrderIdx,
      );
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          PreparationSteps: [
            ...state.currentProps.PreparationSteps.slice(0, idOfOriginal),
            {
              ...action.payload.originalObj,
              [action.payload.prop]: action.payload.value,
            },
            ...state.currentProps.PreparationSteps.slice(idOfOriginal + 1),
          ],
        },
      };
    },
    editOrderOfStep(
      state: ContainerState,
      action: PayloadAction<{
        newOrder: number;
        originalObj: RecipeStep;
      }>,
    ) {
      const idOfOriginal = state.currentProps.PreparationSteps.findIndex(
        ui => ui.OrderIdx === action.payload.originalObj.OrderIdx,
      );
      const idOfOther = state.currentProps.PreparationSteps.findIndex(
        ui => ui.OrderIdx === action.payload.newOrder,
      );
      const stateToRet = {
        ...state,
        currentProps: {
          ...state.currentProps,
          PreparationSteps: [...state.currentProps.PreparationSteps],
        },
      };
      stateToRet.currentProps.PreparationSteps[idOfOther] = {
        ...stateToRet.currentProps.PreparationSteps[idOfOther],
        OrderIdx: stateToRet.currentProps.PreparationSteps[idOfOriginal].OrderIdx,
      };
      stateToRet.currentProps.PreparationSteps[idOfOriginal] = {
        ...stateToRet.currentProps.PreparationSteps[idOfOriginal],
        OrderIdx: action.payload.newOrder,
      };
      stateToRet.currentProps.PreparationSteps.sort((a, b) => a.OrderIdx - b.OrderIdx);
      return stateToRet;
    },
    removeStep(state: ContainerState, action: PayloadAction<RecipeStep>) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          PreparationSteps: state.currentProps.PreparationSteps.filter(
            ui => ui.OrderIdx !== action.payload.OrderIdx,
          ),
        },
      };
    },
    saveRecipeOnChange(state: ContainerState, action: PayloadAction<void>) {
      return state;
    },
    deleteRecipe(state: ContainerState, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const { actions, reducer, name: sliceKey } = recipesPageSlice;
