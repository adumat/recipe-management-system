/**
 *
 * IngredientCategoriesPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useParams, useRouteMatch } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import {
  selectIngredientCategoriesPage,
  selectIngredientCategoryOnEdit,
} from './selectors';
import { ingredientCategoriesPageSaga } from './saga';
import { IdEditorParamTypes, IngredientCategory } from 'types';
import { Table } from 'app/components/Table';
import { history } from 'utils/history';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface Props {}

export function IngredientCategoriesPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: ingredientCategoriesPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ingredientCategoriesPage = useSelector(selectIngredientCategoriesPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.fetchIngredientCategoriesRequest());
  }, []);

  return (
    <>
      <Helmet>
        <title>IngredientCategoriesPage</title>
        <meta
          name="description"
          content="Description of IngredientCategoriesPage"
        />
      </Helmet>
      <Route path={path}>
        <Table<IngredientCategory>
          title={'Ingredient Categories'}
          cellViewModel={[
            {
              id: 'Id',
              label: 'ID',
            },
            {
              id: 'Name',
              label: 'Name',
            },
          ]}
          rows={ingredientCategoriesPage.FetchedIngredients}
          idRowGetter={r => r.Id || -1}
          initialOrderKey={'Name'}
          onAdd={() => history.push(`${path}/new`)}
          onChange={rowId => history.push(`${path}/${rowId[0]}`)}
          onDelete={rowId =>
            dispatch(actions.deleteIngredientCategory(rowId[0] as string))
          }
          checkboxEnable={false}
        />
      </Route>
      <Route path={`${path}/:Id`}>
        <EditDialog origin={path} />
      </Route>
    </>
  );
}

interface EditDialogProps {
  origin: string;
}

function EditDialog(props: EditDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Id, Name } = useSelector(selectIngredientCategoryOnEdit);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const classes = useStyles();

  const { Id: IdParam } = useParams<IdEditorParamTypes>();

  useEffect(() => {
    if (IdParam !== undefined) {
      if (IdParam === 'new') {
        //new ingredient
        dispatch(actions.newIngredientCategory());
      } else {
        //load ingredient
        dispatch(actions.loadIngredientCategory(IdParam));
      }
    }
  }, [IdParam]);

  const handleUndoChanges = () => {
    history.push(props.origin);
  };

  const handleDoChanges = () => {
    dispatch(actions.saveIngredientCategoryOnChange());
    history.push(props.origin);
  };

  return (
    <Dialog
      open={IdParam !== undefined}
      onClose={handleUndoChanges}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {IdParam !== 'new'
          ? 'Edit ingredient category'
          : 'New ingredient category'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {IdParam !== 'new' ? 'Change input below' : 'Fill input below'}
        </DialogContentText>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            disabled
            id="outlined-disabled"
            label="Id"
            helperText="Auto generated Id"
            value={Id}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            required
            id="outlined-required"
            label="Name"
            helperText="Name of category"
            value={Name}
            variant="outlined"
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'Name',
                  value: event.target.value,
                }),
              )
            }
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUndoChanges} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDoChanges} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
