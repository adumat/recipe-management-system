import { PayloadAction } from '@reduxjs/toolkit';
import { RecipeTag } from 'types/Models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the RecipeTagsPage container
export const initialState: ContainerState = {
  FetchedRecipeTags: [],
  currentProps: {
    Id: undefined,
    Name: '',
    Description: '',
    ParentTagId: -1,
  },
};

const recipeTagsPageSlice = createSlice({
  name: 'recipeTagsPage',
  initialState,
  reducers: {
    fetchRecipeTagsRequest(state, action: PayloadAction<void>) {},
    fetchRecipeTagsResult(state, action: PayloadAction<RecipeTag[]>) {
      return {
        ...state,
        FetchedRecipeTags: action.payload,
      };
    },
    loadRecipeTag(state: ContainerState, action: PayloadAction<string>) {
      return state;
    },
    newRecipeTag(state: ContainerState, action: PayloadAction<undefined>) {
      return {
        ...state,
        currentProps: {
          Id: undefined,
          Name: '',
          Description: '',
          ParentTagId: -1,
        },
      };
    },
    fillPropsRecipeTag(
      state: ContainerState,
      action: PayloadAction<RecipeTag>,
    ) {
      return {
        ...state,
        currentProps: action.payload,
      };
    },
    inputPropChanged(
      state: ContainerState,
      action: PayloadAction<{ prop: keyof RecipeTag; value: any }>,
    ) {
      return {
        ...state,
        currentProps: {
          ...state.currentProps,
          [action.payload.prop]: action.payload.value,
        },
      };
    },
    saveRecipeTagOnChange(state: ContainerState, action: PayloadAction<void>) {
      return state;
    },
    deleteRecipeTag(state: ContainerState, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const { actions, reducer, name: sliceKey } = recipeTagsPageSlice;
