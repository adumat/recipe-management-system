import { PayloadAction } from '@reduxjs/toolkit';
import { Ingredient, IngredientCategory } from 'types/Models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the IngredientsPage container
export const initialState: ContainerState = {
  FetchedIngredients: [],
  FetchedIngredientCategories: [],
  currentProps: {
    Id: undefined,
    Name: '',
    CategoryId: -1,
  },
};

const ingredientsPageSlice = createSlice({
  name: 'ingredientsPage',
  initialState,
  reducers: {
    fetchIngredientsRequest(state, action: PayloadAction<void>) {},
    fetchIngredientsResult(state, action: PayloadAction<Ingredient[]>) {
      return {
        ...state,
        FetchedIngredients: action.payload,
      };
    },
    fetchIngredientCategoriesResult(
      state,
      action: PayloadAction<IngredientCategory[]>,
    ) {
      return {
        ...state,
        FetchedIngredientCategories: action.payload,
      };
    },
    loadIngredient(state: ContainerState, action: PayloadAction<string>) {
      return state;
    },
    newIngredient(state: ContainerState, action: PayloadAction<undefined>) {
      return {
        ...state,
        currentProps: {
          Id: undefined,
          Name: '',
          CategoryId: -1,
        },
      };
    },
    fillPropsIngredient(
      state: ContainerState,
      action: PayloadAction<Ingredient>,
    ) {
      return {
        ...state,
        currentProps: action.payload,
      };
    },
    inputPropChanged(
      state: ContainerState,
      action: PayloadAction<{ prop: keyof Ingredient; value: any }>,
    ) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          [action.payload.prop]: action.payload.value,
        },
      };
    },
    saveIngredientOnChange(state: ContainerState, action: PayloadAction<void>) {
      return state;
    },
    deleteIngredient(state: ContainerState, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const { actions, reducer, name: sliceKey } = ingredientsPageSlice;
