/**
 *
 * IngredientsPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useParams, useRouteMatch } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import {
  selectFetchedIngredientCategories,
  selectIngredientOnEdit,
  selectIngredientsPage,
} from './selectors';
import { ingredientsPageSaga } from './saga';
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
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import { IdEditorParamTypes, Ingredient } from 'types/Models';

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

export function IngredientsPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: ingredientsPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ingredientsPage = useSelector(selectIngredientsPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.fetchIngredientsRequest());
  }, []);

  return (
    <>
      <Helmet>
        <title>IngredientsPage</title>
        <meta name="description" content="Description of IngredientsPage" />
      </Helmet>
      <Route path={path}>
        <Table<Ingredient>
          title={'Ingredient'}
          cellViewModel={[
            {
              id: 'Id',
              label: 'ID',
            },
            {
              id: 'Name',
              label: 'Name',
            },
            {
              id: 'CategoryId',
              label: 'Category',
              getValue: row =>
                row.CategoryId === null
                  ? 'None'
                  : ingredientsPage.FetchedIngredientCategories.find(
                      cat => cat.Id === row.CategoryId,
                    )?.Name || 'None',
            },
          ]}
          rows={ingredientsPage.FetchedIngredients}
          idRowGetter={r => r.Id || -1}
          initialOrderKey={'Name'}
          onAdd={() => history.push(`${path}/new`)}
          onChange={rowId => history.push(`${path}/${rowId[0]}`)}
          onDelete={rowId =>
            dispatch(actions.deleteIngredient(rowId[0] as string))
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
  const { Id, Name, CategoryId } = useSelector(selectIngredientOnEdit);
  const categories = useSelector(selectFetchedIngredientCategories);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { Id: IdParam } = useParams<IdEditorParamTypes>();
  const classes = useStyles();

  useEffect(() => {
    if (IdParam !== undefined) {
      if (IdParam === 'new') {
        //new ingredient
        dispatch(actions.newIngredient());
      } else {
        //load ingredient
        dispatch(actions.loadIngredient(IdParam));
      }
    }
  }, [IdParam]);

  const handleUndoChanges = () => {
    history.push(props.origin);
  };

  const handleDoChanges = () => {
    dispatch(actions.saveIngredientOnChange());
    history.push(props.origin);
  };

  return (
    <Dialog
      open={IdParam !== undefined}
      onClose={handleUndoChanges}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {IdParam !== 'new' ? 'Edit ingredient' : 'New ingredient'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {IdParam !== 'new' ? 'Change input below' : 'Fill input below'}
        </DialogContentText>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            disabled
            id="i_id"
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
            id="i_name"
            label="Name"
            helperText="Name of ingredient"
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
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="i_cat-label">Category</InputLabel>
          <Select
            autoWidth
            id="i_cat"
            labelId="i_cat-label"
            label="Category"
            value={CategoryId}
            onChange={event =>
              dispatch(
                actions.inputPropChanged({
                  prop: 'CategoryId',
                  value: event.target.value || -1,
                }),
              )
            }
          >
            <MenuItem key={-1} value={-1}>
              None
            </MenuItem>
            {categories.map(category => (
              <MenuItem key={category.Id} value={category.Id}>
                {category.Name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Ingredient category</FormHelperText>
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
