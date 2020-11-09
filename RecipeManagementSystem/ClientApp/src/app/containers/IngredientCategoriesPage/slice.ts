import { PayloadAction } from '@reduxjs/toolkit';
import { IngredientCategory } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the IngredientCategoriesPage container
export const initialState: ContainerState = {
  FetchedIngredients: [],
  currentProps: {
    Id: undefined,
    Name: '',
  },
};

const ingredientCategoriesPageSlice = createSlice({
  name: 'ingredientCategoriesPage',
  initialState,
  reducers: {
    fetchIngredientCategoriesRequest(state, action: PayloadAction<void>) {},
    fetchIngredientCategoriesResult(
      state,
      action: PayloadAction<IngredientCategory[]>,
    ) {
      return {
        ...state,
        FetchedIngredients: action.payload,
      };
    },
    loadIngredientCategory(
      state: ContainerState,
      action: PayloadAction<string>,
    ) {
      return state;
    },
    newIngredientCategory(
      state: ContainerState,
      action: PayloadAction<undefined>,
    ) {
      return {
        ...state,
        currentProps: {
          Id: undefined,
          Name: '',
        },
      };
    },
    fillPropsIngredientCategory(
      state: ContainerState,
      action: PayloadAction<IngredientCategory>,
    ) {
      return {
        ...state,
        currentProps: action.payload,
      };
    },
    inputPropChanged(
      state: ContainerState,
      action: PayloadAction<{ prop: keyof IngredientCategory; value: any }>,
    ) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          [action.payload.prop]: action.payload.value,
        },
      };
    },
    saveIngredientCategoryOnChange(
      state: ContainerState,
      action: PayloadAction<void>,
    ) {
      return state;
    },
    deleteIngredientCategory(
      state: ContainerState,
      action: PayloadAction<string>,
    ) {
      return state;
    },
  },
});

export const {
  actions,
  reducer,
  name: sliceKey,
} = ingredientCategoriesPageSlice;
