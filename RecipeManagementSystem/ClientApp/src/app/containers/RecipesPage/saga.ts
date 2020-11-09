import { take, call, put, select, all, takeLatest } from 'redux-saga/effects';
import { apiDelete, apiGet, apiPost, apiPut } from 'utils/request';
import { selectRecipesPage } from './selectors';
import { actions } from './slice';
import { ContainerState } from './types';
import { actions as NotificationActions } from 'store/notifications';
import { history, goBack } from 'utils/history';
import { Ingredient, Recipe, RecipeTag } from 'types/Models';

function* doFetchOfRecipes() {
  const response: Recipe[] = yield call(apiGet, 'api/Recipe');
  yield put(actions.fetchRecipesResult(response));

  const tags: RecipeTag[] = yield call(apiGet, 'api/RecipeTag');
  yield put(actions.fetchRecipeTagsResult(tags));

  const ingredients: Ingredient[] = yield call(apiGet, 'api/Ingredient');
  yield put(actions.fetchIngredientsResult(ingredients));
}

function* fetchOfRecipesHandler() {
  yield takeLatest(actions.fetchRecipesRequest.type, doFetchOfRecipes);
}

function* doFetchOfRecipe(action) {
  try {
    const response: Recipe = yield call(apiGet, 'api/Recipe/' + action.payload);
    yield put(actions.fillPropsRecipe(response));
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Recipe not found',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
    history.push(goBack());
  }
}

function* fetchOfRecipeHandler() {
  yield takeLatest(actions.loadRecipe.type, doFetchOfRecipe);
}

function* doSaveOfRecipeOnChange() {
  const state: ContainerState = yield select(selectRecipesPage);
  try {
    if (state.currentProps.Id !== undefined) {
      const response = yield call(
        apiPut,
        'api/Recipe/' + state.currentProps.Id,
        state.currentProps,
      );
    } else {
      const response: Recipe = yield call(
        apiPost,
        'api/Recipe',
        state.currentProps,
      );
    }
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Saved',
        key: new Date().getTime(),
        options: {
          variant: 'success',
        },
      }),
    );
    yield put(actions.fetchRecipesRequest());
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Error during save',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

function* saveOfRecipeOnChangeHandler() {
  yield takeLatest(actions.saveRecipeOnChange.type, doSaveOfRecipeOnChange);
}

function* doDeleteOfRecipe(action) {
  try {
    const response: Recipe = yield call(
      apiDelete,
      'api/Recipe/' + action.payload,
    );
    yield put(actions.fetchRecipesRequest());
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Error deleting Recipe',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

function* deleteOfRecipeHandler() {
  yield takeLatest(actions.deleteRecipe.type, doDeleteOfRecipe);
}

export function* recipesPageSaga() {
  yield all([
    fetchOfRecipesHandler(),
    fetchOfRecipeHandler(),
    saveOfRecipeOnChangeHandler(),
    deleteOfRecipeHandler(),
  ]);
}
