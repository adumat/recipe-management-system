import { take, call, put, select, all, takeLatest } from 'redux-saga/effects';
import { IngredientCategory } from 'types';
import { apiDelete, apiGet, apiPost, apiPut } from 'utils/request';
import { selectIngredientCategoriesPage } from './selectors';
import { actions } from './slice';
import { ContainerState } from './types';
import { actions as NotificationActions } from 'store/notifications';
import { history, goBack } from 'utils/history';

function* doFetchOfIngredientCategories() {
  const response: IngredientCategory[] = yield call(
    apiGet,
    'api/IngredientCategory',
  );

  yield put(actions.fetchIngredientCategoriesResult(response));
}

function* fetchOfIngredientCategoriesHandler() {
  yield takeLatest(
    actions.fetchIngredientCategoriesRequest.type,
    doFetchOfIngredientCategories,
  );
}

function* doFetchOfIngredientCategory(action) {
  try {
    const response: IngredientCategory = yield call(
      apiGet,
      'api/IngredientCategory/' + action.payload,
    );
    yield put(actions.fillPropsIngredientCategory(response));
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Ingredient category not found',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        }
      }),
    );
    history.push(goBack());
  }
}

function* fetchOfIngredientCategoryHandler() {
  yield takeLatest(
    actions.loadIngredientCategory.type,
    doFetchOfIngredientCategory,
  );
}

function* doSaveOfIngredientCategoryOnChange() {
  const state: ContainerState = yield select(selectIngredientCategoriesPage);
  try {
    if (state.currentProps.Id !== undefined) {
      const response = yield call(
        apiPut,
        'api/IngredientCategory/' + state.currentProps.Id,
        state.currentProps,
      );
    } else {
      const response: IngredientCategory = yield call(
        apiPost,
        'api/IngredientCategory',
        state.currentProps,
      );
    }
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Saved',
        key: new Date().getTime(),
        options: {
          variant: 'success',
        }
      }),
    );
    yield put(actions.fetchIngredientCategoriesRequest());
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Error during save',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        }
      }),
    );
  }
}

function* saveOfIngredientCategoryOnChangeHandler() {
  yield takeLatest(
    actions.saveIngredientCategoryOnChange.type,
    doSaveOfIngredientCategoryOnChange,
  );
}

function* doDeleteOfIngredientCategory(action) {
  try {
    const response: IngredientCategory = yield call(
      apiDelete,
      'api/IngredientCategory/' + action.payload,
    );
    yield put(actions.fetchIngredientCategoriesRequest());
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Error deleting ingredient category',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        }
      }),
    );
  }
}

function* deleteOfIngredientCategoryHandler() {
  yield takeLatest(
    actions.deleteIngredientCategory.type,
    doDeleteOfIngredientCategory,
  );
}

export function* ingredientCategoriesPageSaga() {
  yield all([
    fetchOfIngredientCategoriesHandler(),
    fetchOfIngredientCategoryHandler(),
    saveOfIngredientCategoryOnChangeHandler(),
    deleteOfIngredientCategoryHandler(),
  ]);
}
