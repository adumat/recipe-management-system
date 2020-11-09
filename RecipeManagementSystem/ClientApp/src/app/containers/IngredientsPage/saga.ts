import { take, call, put, select, all, takeLatest } from 'redux-saga/effects';
import { apiDelete, apiGet, apiPost, apiPut } from 'utils/request';
import { selectIngredientsPage } from './selectors';
import { actions } from './slice';
import { ContainerState } from './types';
import { actions as NotificationActions } from 'store/notifications';
import { history, goBack } from 'utils/history';
import { Ingredient, IngredientCategory } from 'types/Models';

function* doFetchOfIngredients() {
  const response: Ingredient[] = yield call(apiGet, 'api/Ingredient');

  yield put(actions.fetchIngredientsResult(response));
  const categories: IngredientCategory[] = yield call(
    apiGet,
    'api/IngredientCategory',
  );

  yield put(actions.fetchIngredientCategoriesResult(categories));
}

function* fetchOfIngredientsHandler() {
  yield takeLatest(actions.fetchIngredientsRequest.type, doFetchOfIngredients);
}

function* doFetchOfIngredient(action) {
  try {
    const response: Ingredient = yield call(
      apiGet,
      'api/Ingredient/' + action.payload,
    );
    response.CategoryId = response.CategoryId || -1;
    yield put(actions.fillPropsIngredient(response));
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Ingredient not found',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
    history.push(goBack());
  }
}

function* fetchOfIngredientHandler() {
  yield takeLatest(actions.loadIngredient.type, doFetchOfIngredient);
}

function* doSaveOfIngredientOnChange() {
  const state: ContainerState = yield select(selectIngredientsPage);
  try {
    if (state.currentProps.Id !== undefined) {
      const response = yield call(
        apiPut,
        'api/Ingredient/' + state.currentProps.Id,
        state.currentProps,
      );
    } else {
      const response: Ingredient = yield call(
        apiPost,
        'api/Ingredient',
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
    yield put(actions.fetchIngredientsRequest());
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

function* saveOfIngredientOnChangeHandler() {
  yield takeLatest(
    actions.saveIngredientOnChange.type,
    doSaveOfIngredientOnChange,
  );
}

function* doDeleteOfIngredient(action) {
  try {
    const response: Ingredient = yield call(
      apiDelete,
      'api/Ingredient/' + action.payload,
    );
    yield put(actions.fetchIngredientsRequest());
  } catch (e) {
    yield put(
      NotificationActions.enqueueSnackbar({
        message: 'Error deleting ingredient',
        key: new Date().getTime(),
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

function* deleteOfIngredientHandler() {
  yield takeLatest(actions.deleteIngredient.type, doDeleteOfIngredient);
}

export function* ingredientsPageSaga() {
  yield all([
    fetchOfIngredientsHandler(),
    fetchOfIngredientHandler(),
    saveOfIngredientOnChangeHandler(),
    deleteOfIngredientHandler(),
  ]);
}
