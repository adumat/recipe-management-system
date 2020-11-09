import { take, call, put, select, all, takeLatest } from 'redux-saga/effects';
import { apiDelete, apiGet, apiPost, apiPut } from 'utils/request';
import { selectRecipeTagsPage } from './selectors';
import { actions } from './slice';
import { ContainerState } from './types';
import { actions as NotificationActions } from 'store/notifications';
import { history, goBack } from 'utils/history';
import { RecipeTag } from 'types/Models';

function* doFetchOfRecipeTags() {
  const response: RecipeTag[] = yield call(apiGet, 'api/RecipeTag');

  yield put(actions.fetchRecipeTagsResult(response));
}

function* fetchOfRecipeTagsHandler() {
  yield takeLatest(actions.fetchRecipeTagsRequest.type, doFetchOfRecipeTags);
}

function* doFetchOfRecipeTag(action) {
  try {
    const response: RecipeTag = yield call(
      apiGet,
      'api/RecipeTag/' + action.payload,
    );
    response.ParentTagId = response.ParentTagId || -1;
    yield put(actions.fillPropsRecipeTag(response));
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Recipe Tag not found',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
    history.push(goBack());
  }
}

function* fetchOfRecipeTagHandler() {
  yield takeLatest(actions.loadRecipeTag.type, doFetchOfRecipeTag);
}

function* doSaveOfRecipeTagOnChange() {
  const state: ContainerState = yield select(selectRecipeTagsPage);
  try {
    if (state.currentProps.Id !== undefined) {
      const response = yield call(
        apiPut,
        'api/RecipeTag/' + state.currentProps.Id,
        state.currentProps,
      );
    } else {
      const response: RecipeTag = yield call(
        apiPost,
        'api/RecipeTag',
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
    yield put(actions.fetchRecipeTagsRequest());
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

function* saveOfRecipeTagOnChangeHandler() {
  yield takeLatest(
    actions.saveRecipeTagOnChange.type,
    doSaveOfRecipeTagOnChange,
  );
}

function* doDeleteOfRecipeTag(action) {
  try {
    const response: RecipeTag = yield call(
      apiDelete,
      'api/RecipeTag/' + action.payload,
    );
    yield put(actions.fetchRecipeTagsRequest());
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Error deleting Recipe Tag',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

function* deleteOfRecipeTagHandler() {
  yield takeLatest(actions.deleteRecipeTag.type, doDeleteOfRecipeTag);
}

export function* recipeTagsPageSaga() {
  yield all([
    fetchOfRecipeTagsHandler(),
    fetchOfRecipeTagHandler(),
    saveOfRecipeTagOnChangeHandler(),
    deleteOfRecipeTagHandler(),
  ]);
}
